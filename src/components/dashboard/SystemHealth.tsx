import { Card, CardHeader, CardContent, CardTitle } from '../ui/Card';
import { Badge } from '../ui/Badge';

export function SystemHealth() {
  const systems = [
    { name: 'API Gateway', status: 'operational', uptime: '99.9%' },
    { name: 'Model Inference', status: 'operational', uptime: '99.8%' },
    { name: 'Data Pipeline', status: 'operational', uptime: '99.7%' },
    { name: 'Authentication', status: 'operational', uptime: '100%' },
    { name: 'Storage', status: 'degraded', uptime: '98.2%' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'operational':
        return <Badge variant="success">Operational</Badge>;
      case 'degraded':
        return <Badge variant="warning">Degraded</Badge>;
      case 'down':
        return <Badge variant="error">Down</Badge>;
      default:
        return <Badge variant="neutral">Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>System Health</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {systems.map((system, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{system.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Uptime: {system.uptime}</p>
              </div>
              <div>{getStatusBadge(system.status)}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
