'use client';

import { v4 as uuidv4 } from 'uuid';
import type {
  AP2Task,
  AP2Action,
  AP2Resource,
  AP2Event,
  AP2TaskResult,
  AP2ExecutionPlan,
  AP2Message,
  TaskStatus,
  ActionType,
} from '@/types/ap2';

class AP2Manager {
  private tasks: Map<string, AP2Task> = new Map();
  private actions: Map<string, AP2Action> = new Map();
  private resources: Map<string, AP2Resource> = new Map();
  private events: AP2Event[] = [];
  private eventListeners: Map<string, (event: AP2Event) => void> = new Map();

  // Create a new task
  createTask(
    name: string,
    description: string,
    agentId: string,
    actions: Omit<AP2Action, 'id' | 'taskId' | 'status'>[],
    resources?: Omit<AP2Resource, 'id' | 'allocated'>[]
  ): AP2Task {
    const taskId = uuidv4();

    const task: AP2Task = {
      id: taskId,
      name,
      description,
      status: 'pending',
      agentId,
      actions: actions.map((action, index) => ({
        ...action,
        id: uuidv4(),
        taskId,
        status: 'pending' as TaskStatus,
      })),
      resources: (resources || []).map(resource => ({
        ...resource,
        id: uuidv4(),
        allocated: false,
      })),
      createdAt: new Date(),
      progress: 0,
    };

    this.tasks.set(task.id, task);
    task.actions.forEach(action => this.actions.set(action.id, action));
    task.resources.forEach(resource => this.resources.set(resource.id, resource));

    this.emitEvent({
      id: uuidv4(),
      type: 'task_started',
      taskId: task.id,
      timestamp: new Date(),
      data: { taskName: task.name },
    });

    return task;
  }

  // Execute a task
  async executeTask(taskId: string): Promise<AP2TaskResult> {
    const task = this.tasks.get(taskId);
    if (!task) {
      throw new Error(`Task ${taskId} not found`);
    }

    task.status = 'running';
    task.startedAt = new Date();
    const startTime = Date.now();

    let completedActions = 0;
    let failedActions = 0;

    try {
      // Allocate resources
      for (const resource of task.resources) {
        await this.allocateResource(resource.id);
      }

      // Execute actions in order
      for (const action of task.actions) {
        try {
          await this.executeAction(action.id);
          completedActions++;
          task.progress = Math.round((completedActions / task.actions.length) * 100);
        } catch (error) {
          failedActions++;
          action.status = 'failed';
          action.error = error instanceof Error ? error.message : 'Unknown error';
        }
      }

      // Determine final status
      if (failedActions === 0) {
        task.status = 'completed';
        task.result = this.aggregateActionResults(task.actions);
      } else if (completedActions === 0) {
        task.status = 'failed';
        task.error = 'All actions failed';
      } else {
        task.status = 'completed';
        task.result = this.aggregateActionResults(task.actions);
        task.error = `${failedActions} action(s) failed`;
      }

      task.completedAt = new Date();
      task.progress = 100;

      this.emitEvent({
        id: uuidv4(),
        type: task.status === 'completed' ? 'task_completed' : 'task_failed',
        taskId: task.id,
        timestamp: new Date(),
        data: { result: task.result, error: task.error },
      });

    } catch (error) {
      task.status = 'failed';
      task.error = error instanceof Error ? error.message : 'Task execution failed';
      task.completedAt = new Date();

      this.emitEvent({
        id: uuidv4(),
        type: 'task_failed',
        taskId: task.id,
        timestamp: new Date(),
        data: { error: task.error },
      });
    } finally {
      // Release resources
      for (const resource of task.resources) {
        await this.releaseResource(resource.id);
      }
    }

    const duration = Date.now() - startTime;

    return {
      taskId: task.id,
      status: task.status,
      output: task.result,
      error: task.error,
      metrics: {
        duration,
        actionsCompleted: completedActions,
        actionsFailed: failedActions,
        resourcesUsed: task.resources.length,
      },
    };
  }

  // Execute an action
  private async executeAction(actionId: string): Promise<any> {
    const action = this.actions.get(actionId);
    if (!action) {
      throw new Error(`Action ${actionId} not found`);
    }

    action.status = 'running';
    action.startedAt = new Date();

    this.emitEvent({
      id: uuidv4(),
      type: 'action_started',
      actionId: action.id,
      taskId: action.taskId,
      timestamp: new Date(),
      data: { actionType: action.type, actionName: action.name },
    });

    try {
      // Simulate action execution
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock result based on action type
      action.result = this.generateMockResult(action.type, action.parameters);
      action.status = 'completed';
      action.completedAt = new Date();

      this.emitEvent({
        id: uuidv4(),
        type: 'action_completed',
        actionId: action.id,
        taskId: action.taskId,
        timestamp: new Date(),
        data: { result: action.result },
      });

      return action.result;
    } catch (error) {
      action.status = 'failed';
      action.error = error instanceof Error ? error.message : 'Action failed';
      action.completedAt = new Date();
      throw error;
    }
  }

  // Allocate resource
  private async allocateResource(resourceId: string): Promise<void> {
    const resource = this.resources.get(resourceId);
    if (!resource) {
      throw new Error(`Resource ${resourceId} not found`);
    }

    resource.allocated = true;

    this.emitEvent({
      id: uuidv4(),
      type: 'resource_allocated',
      resourceId: resource.id,
      timestamp: new Date(),
      data: { resourceType: resource.type, resourceName: resource.name },
    });
  }

  // Release resource
  private async releaseResource(resourceId: string): Promise<void> {
    const resource = this.resources.get(resourceId);
    if (!resource) return;

    resource.allocated = false;

    this.emitEvent({
      id: uuidv4(),
      type: 'resource_released',
      resourceId: resource.id,
      timestamp: new Date(),
      data: { resourceType: resource.type, resourceName: resource.name },
    });
  }

  // Generate mock result based on action type
  private generateMockResult(type: ActionType, parameters: Record<string, any>): any {
    switch (type) {
      case 'query':
        return {
          answer: `Query result for: ${JSON.stringify(parameters)}`,
          confidence: 0.85,
          sources: ['mock_source_1', 'mock_source_2'],
        };
      case 'execute':
        return {
          success: true,
          output: `Executed with parameters: ${JSON.stringify(parameters)}`,
          exitCode: 0,
        };
      case 'observe':
        return {
          observations: ['observation_1', 'observation_2'],
          timestamp: new Date().toISOString(),
        };
      case 'plan':
        return {
          steps: ['step_1', 'step_2', 'step_3'],
          estimatedDuration: 5000,
        };
      case 'delegate':
        return {
          delegated: true,
          delegateTo: 'mock_agent',
          status: 'accepted',
        };
      default:
        return { result: 'completed' };
    }
  }

  // Aggregate action results
  private aggregateActionResults(actions: AP2Action[]): any {
    return {
      totalActions: actions.length,
      completedActions: actions.filter(a => a.status === 'completed').length,
      results: actions
        .filter(a => a.result)
        .map(a => ({ actionId: a.id, actionName: a.name, result: a.result })),
    };
  }

  // Get task by ID
  getTask(taskId: string): AP2Task | undefined {
    return this.tasks.get(taskId);
  }

  // Get all tasks
  getAllTasks(): AP2Task[] {
    return Array.from(this.tasks.values());
  }

  // Cancel task
  cancelTask(taskId: string): void {
    const task = this.tasks.get(taskId);
    if (task && task.status === 'running') {
      task.status = 'cancelled';
      task.completedAt = new Date();
      task.actions.forEach(action => {
        if (action.status === 'running' || action.status === 'pending') {
          action.status = 'cancelled';
        }
      });
    }
  }

  // Subscribe to events
  on(eventType: string, callback: (event: AP2Event) => void): () => void {
    const listenerId = uuidv4();
    this.eventListeners.set(listenerId, callback);
    return () => this.eventListeners.delete(listenerId);
  }

  // Emit event
  private emitEvent(event: AP2Event): void {
    this.events.push(event);
    this.eventListeners.forEach(callback => callback(event));
  }

  // Get events for task
  getTaskEvents(taskId: string): AP2Event[] {
    return this.events.filter(e => e.taskId === taskId);
  }

  // Get task statistics
  getTaskStatistics() {
    const tasks = Array.from(this.tasks.values());
    return {
      total: tasks.length,
      pending: tasks.filter(t => t.status === 'pending').length,
      running: tasks.filter(t => t.status === 'running').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      failed: tasks.filter(t => t.status === 'failed').length,
      cancelled: tasks.filter(t => t.status === 'cancelled').length,
    };
  }
}

// Singleton instance
export const ap2Manager = new AP2Manager();
