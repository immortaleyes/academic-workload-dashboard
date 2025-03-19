
import React, { useMemo } from "react";
import { useFaculty } from "@/context/FacultyContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { AlertTriangle, CheckCircle, HelpCircle } from "lucide-react";

export const FacultyWorkloadDashboard: React.FC = () => {
  const { faculty, loading } = useFaculty();

  const workloadData = useMemo(() => {
    return faculty.map(member => ({
      name: member.name.split(' ')[1], // Last name for shorter labels
      fullName: member.name,
      department: member.department,
      teaching: member.workload.teachingHours,
      lab: member.workload.labHours,
      meeting: member.workload.meetingHours,
      total: member.workload.teachingHours + member.workload.labHours + member.workload.meetingHours,
      id: member.id
    }));
  }, [faculty]);
  
  // Sort faculty by total workload
  const sortedWorkloadData = [...workloadData].sort((a, b) => b.total - a.total);
  
  // Define workload thresholds for categorization
  const highWorkloadThreshold = 25; // Hours per week considered high
  const lowWorkloadThreshold = 15;  // Hours per week considered low
  
  // Categorize faculty by workload
  const highWorkload = sortedWorkloadData.filter(f => f.total >= highWorkloadThreshold);
  const lowWorkload = sortedWorkloadData.filter(f => f.total <= lowWorkloadThreshold);
  const balancedWorkload = sortedWorkloadData.filter(f => f.total > lowWorkloadThreshold && f.total < highWorkloadThreshold);
  
  // Calculate average workload
  const averageWorkload = workloadData.length > 0 
    ? workloadData.reduce((sum, item) => sum + item.total, 0) / workloadData.length 
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <span>Overloaded Faculty</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highWorkload.length}</div>
            <div className="text-sm text-muted-foreground">
              Faculty with {highWorkloadThreshold}+ hours of weekly workload
            </div>
            <div className="mt-4 space-y-2">
              {highWorkload.slice(0, 3).map(faculty => (
                <div key={faculty.id} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{faculty.fullName}</span>
                  <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
                    {faculty.total} hrs
                  </Badge>
                </div>
              ))}
              {highWorkload.length > 3 && (
                <div className="text-sm text-muted-foreground text-right">
                  +{highWorkload.length - 3} more
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>Balanced Faculty</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{balancedWorkload.length}</div>
            <div className="text-sm text-muted-foreground">
              Faculty with balanced workload
            </div>
            <div className="mt-4 space-y-2">
              {balancedWorkload.slice(0, 3).map(faculty => (
                <div key={faculty.id} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{faculty.fullName}</span>
                  <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                    {faculty.total} hrs
                  </Badge>
                </div>
              ))}
              {balancedWorkload.length > 3 && (
                <div className="text-sm text-muted-foreground text-right">
                  +{balancedWorkload.length - 3} more
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-950 dark:to-yellow-900">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-yellow-500" />
              <span>Underutilized Faculty</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lowWorkload.length}</div>
            <div className="text-sm text-muted-foreground">
              Faculty with less than {lowWorkloadThreshold} hours weekly
            </div>
            <div className="mt-4 space-y-2">
              {lowWorkload.slice(0, 3).map(faculty => (
                <div key={faculty.id} className="flex justify-between items-center">
                  <span className="text-sm font-medium">{faculty.fullName}</span>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                    {faculty.total} hrs
                  </Badge>
                </div>
              ))}
              {lowWorkload.length > 3 && (
                <div className="text-sm text-muted-foreground text-right">
                  +{lowWorkload.length - 3} more
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Faculty Workload Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            {loading ? (
              <div className="h-full w-full flex items-center justify-center">
                <div className="animate-pulse bg-gray-200 h-full w-full rounded"></div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sortedWorkloadData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={80}
                  />
                  <YAxis 
                    label={{ 
                      value: 'Hours', 
                      angle: -90, 
                      position: 'insideLeft',
                      style: { textAnchor: 'middle' }
                    }} 
                  />
                  <Tooltip
                    formatter={(value, name) => {
                      switch(name) {
                        case 'teaching': return [`${value} hrs (Teaching)`, 'Teaching'];
                        case 'lab': return [`${value} hrs (Lab)`, 'Lab Work'];
                        case 'meeting': return [`${value} hrs (Meeting)`, 'Meetings'];
                        default: return [`${value} hrs`, name];
                      }
                    }}
                    labelFormatter={(label, payload) => {
                      if (payload && payload.length > 0) {
                        return payload[0].payload.fullName;
                      }
                      return label;
                    }}
                  />
                  <Legend />
                  <Bar dataKey="teaching" stackId="a" fill="#3b82f6" name="Teaching" />
                  <Bar dataKey="lab" stackId="a" fill="#10b981" name="Lab Work" />
                  <Bar dataKey="meeting" stackId="a" fill="#f59e0b" name="Meetings" />
                  {/* Add average workload reference line */}
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg dark:bg-blue-950">
              <div>
                <div className="text-sm text-muted-foreground">Average Teaching</div>
                <div className="text-2xl font-semibold">
                  {Math.round(workloadData.reduce((sum, item) => sum + item.teaching, 0) / workloadData.length || 0)} hrs
                </div>
              </div>
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <BookOpenIcon className="h-5 w-5 text-white" />
              </div>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg dark:bg-green-950">
              <div>
                <div className="text-sm text-muted-foreground">Average Lab Work</div>
                <div className="text-2xl font-semibold">
                  {Math.round(workloadData.reduce((sum, item) => sum + item.lab, 0) / workloadData.length || 0)} hrs
                </div>
              </div>
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <BeakerIcon className="h-5 w-5 text-white" />
              </div>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-amber-50 rounded-lg dark:bg-amber-950">
              <div>
                <div className="text-sm text-muted-foreground">Average Meetings</div>
                <div className="text-2xl font-semibold">
                  {Math.round(workloadData.reduce((sum, item) => sum + item.meeting, 0) / workloadData.length || 0)} hrs
                </div>
              </div>
              <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                <UsersIcon className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Define icons here to avoid circular imports
const BookOpenIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);

const BeakerIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M8 2h8"/>
    <path d="M9 2v7.14A6 6 0 0 1 6 14.5V20a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-5.5a6 6 0 0 1-3-5.36V2"/>
    <path d="M12 15a1 1 0 0 0-1 1v1a1 1 0 0 0 2 0v-1a1 1 0 0 0-1-1z"/>
  </svg>
);

const UsersIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);

export default FacultyWorkloadDashboard;
