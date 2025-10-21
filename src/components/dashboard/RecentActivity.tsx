import { Card, CardHeader, CardContent, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';

export function RecentActivity() {
  const activities = [
    {
      action: 'Model deployed',
      model: 'gpt-4-turbo',
      user: 'Sarah Chen',
      time: '2 minutes ago',
      type: 'deployment',
    },
    {
      action: 'API key created',
      model: 'Production Environment',
      user: 'Mike Johnson',
      time: '15 minutes ago',
      type: 'security',
    },
    {
      action: 'Evaluation completed',
      model: 'claude-3-opus',
      user: 'System',
      time: '1 hour ago',
      type: 'evaluation',
    },
    {
      action: 'Cost alert triggered',
      model: 'Monthly budget exceeded 80%',
      user: 'System',
      time: '2 hours ago',
      type: 'alert',
    },
    {
      action: 'Team member added',
      model: 'Alex Rivera',
      user: 'Sarah Chen',
      time: '3 hours ago',
      type: 'team',
    },
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'deployment':
        return 'text-blue-600 dark:text-blue-400';
      case 'security':
        return 'text-purple-600 dark:text-purple-400';
      case 'evaluation':
        return 'text-green-600 dark:text-green-400';
      case 'alert':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'team':
        return 'text-pink-600 dark:text-pink-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flow-root">
          <ul className="-mb-8">
            {activities.map((activity, index) => (
              <li key={index}>
                <div className="relative pb-8">
                  {index !== activities.length - 1 && (
                    <span
                      className="absolute left-2 top-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                      aria-hidden="true"
                    />
                  )}
                  <div className="relative flex space-x-3">
                    <div>
                      <span
                        className={`h-4 w-4 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-gray-800 ${getTypeColor(
                          activity.type
                        )}`}
                      >
                        <span className="h-2 w-2 rounded-full bg-current" />
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-900 dark:text-white">
                          {activity.action}{' '}
                          <span className="font-medium text-gray-900 dark:text-white">
                            {activity.model}
                          </span>
                        </p>
                        <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                          by {activity.user}
                        </p>
                      </div>
                      <div className="whitespace-nowrap text-right text-xs text-gray-500 dark:text-gray-400">
                        {activity.time}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
