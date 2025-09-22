import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, CheckCircle2, Plus, FileText, AlertTriangle, Search } from "lucide-react";
import { useTimer } from "@/hooks/useTimer";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { v4 as uuidv4 } from "uuid";
import { Task, TaskFormData } from "@/types/Task";
import { Input } from "@/components/ui/input";
import { TaskForm } from "@/components/TaskForm";
import TaskCard from "@/components/TaskCard";

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [testStarted, setTestStarted] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputValue, setInputValue] = useState('');

  const { timeRemaining, isTimeUp, formatTime, startTimer, resetTimer } = useTimer(3600); // 60 minutes

  // Load tasks from localStorage on mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch (e) {
        console.error('Error parsing tasks from localStorage:', e);
      }
    }
    setTimeout(() => setIsLoading(false), 500); // Simulate loading delay
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // Debounce search input to reduce unnecessary re-renders
  // Updates searchQuery after a 300ms delay when inputValue changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(inputValue); // Set searchQuery after debounce delay
    }, 300);

    // Cleanup: Clear timeout if inputValue changes before 300ms
    return () => clearTimeout(handler);
  }, [inputValue]);

  const handleStartTest = () => {
    setTestStarted(true);
    startTimer();
  };

  const handleResetTest = () => {
    setTestStarted(false);
    resetTimer();
    setTasks([]);
    setShowForm(false);
    setEditingTask(null);
    setSearchQuery('');
    setInputValue('');
  };

  // Handle form submission for adding or editing tasks
  const handleSubmitTask = (taskData: TaskFormData) => {
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? { ...editingTask, ...taskData } : t));
      setEditingTask(null);
    } else {
      const task: Task = {
        ...taskData,
        id: uuidv4(),
        completed: false,
        createdAt: new Date(),
      };
      setTasks([...tasks, task]);
    }
    setShowForm(false);
  };

  // Edit task: Set editingTask and show form
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  // Delete task: Filter out task by ID
  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  // Toggle task completion status
  const handleToggleComplete = (taskId: string) => {
    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  // Filter tasks based on debounced search query
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
                60-Minute Frontend Test
              </h1>
              <p className="text-muted-foreground mt-2">
                Build a Task Management Application
              </p>
            </div>
            <div className="flex items-center gap-4">
              {!testStarted ? (
                <Button onClick={handleStartTest} size="lg" className="bg-primary hover:bg-primary/90">
                  Start Test
                </Button>
              ) : (
                <>
                  <div className={`flex items-center gap-2 text-sm font-medium px-3 py-1 rounded-full ${
                    timeRemaining <= 300 ? 'bg-destructive/20 text-destructive' :
                    timeRemaining <= 900 ? 'bg-warning/20 text-warning' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    <Clock className="w-4 h-4" />
                    <span>Time Remaining: {formatTime(timeRemaining)}</span>
                  </div>
                  <Button onClick={handleResetTest} variant="outline" size="sm">
                    Reset Test
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Time Up Alert */}
        {isTimeUp && (
          <Alert className="mb-6 border-destructive bg-destructive/10 animate-fade-in">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive font-medium">
              Time's up! The 60-minute test period has ended. Please stop coding and review your work.
            </AlertDescription>
          </Alert>
        )}

        {/* Test Not Started State */}
        {!testStarted && (
          <div className="flex items-center justify-center min-h-[60vh]">
            <Card className="max-w-2xl animate-fade-in-up">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Ready to Start Your 60-Minute Test?</CardTitle>
                <CardDescription className="text-lg">
                  Once you click "Start Test", the timer will begin and you'll have exactly 60 minutes to complete the task management application.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">What you'll be building:</h3>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• TaskCard component with proper TypeScript interfaces</li>
                    <li>• CRUD operations with localStorage persistence</li>
                    <li>• Validated task form with error handling</li>
                    <li>• Responsive design with smooth animations</li>
                    <li>• Search functionality to filter tasks</li>
                  </ul>
                </div>
                <div className="flex justify-center pt-4">
                  <Button onClick={handleStartTest} size="lg" className="bg-primary hover:bg-primary/90">
                    <Clock className="w-4 h-4 mr-2" />
                    Start 60-Minute Test
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Test Content - Only show when test is started */}
        {testStarted && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Requirements Panel */}
              <div className="lg:col-span-1">
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      Test Requirements
                    </CardTitle>
                    <CardDescription>
                      Complete these features within 60 minutes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">✅ Project Setup (5min)</h4>
                      <p className="text-xs text-muted-foreground">Understanding the codebase and technologies</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">✅ TaskCard Component (15min)</h4>
                      <p className="text-xs text-muted-foreground">Create reusable task display component</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">✅ State Management (10min)</h4>
                      <p className="text-xs text-muted-foreground">CRUD operations with localStorage</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">✅ Task Form (15min)</h4>
                      <p className="text-xs text-muted-foreground">Form with validation and error handling</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">✅ Styling & UX (10min)</h4>
                      <p className="text-xs text-muted-foreground">Animations, responsive design, accessibility</p>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">✅ Advanced Feature (5min)</h4>
                      <p className="text-xs text-muted-foreground">Search functionality to filter tasks</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Application Area */}
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  {/* Action Bar */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold">My Tasks</h2>
                      <p className="text-muted-foreground">
                        {filteredTasks.length === 0 ? "No tasks found" : `${filteredTasks.length} tasks`}
                      </p>
                    </div>
                    <Button
                      onClick={() => setShowForm(!showForm)}
                      className="bg-primary hover:bg-primary/90 transition-all duration-200 hover:scale-105"
                      disabled={isTimeUp}
                      aria-label={showForm ? "Hide task form" : "Show task form"}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {showForm ? "Hide Form" : "Add Task"}
                    </Button>
                  </div>

                  {/* Search Input */}
                  <div className="mb-6 relative">
                    <Input
                      type="text"
                      value={inputValue}
                      onChange={e => setInputValue(e.target.value)}
                      placeholder="Search tasks by title or description..."
                      className="w-full pl-12 p-2 border border-gray-700 rounded-md bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                      aria-label="Search tasks"
                      disabled={isTimeUp}
                    />
                    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-300" />
                  </div>

                  {/* Task Form */}
                  {showForm && (
                    <TaskForm
                      onSubmit={handleSubmitTask}
                      onCancel={() => {
                        setShowForm(false);
                        setEditingTask(null);
                      }}
                      initialTask={editingTask ? {
                        title: editingTask.title,
                        description: editingTask.description,
                        priority: editingTask.priority,
                        dueDate: editingTask.dueDate.split('T')[0],
                      } : undefined}
                      isEditing={!!editingTask}
                    />
                  )}

                  {/* Task List Area */}
                  <div className="space-y-4">
                    {isLoading ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, index) => (
                          <Card key={index} className="p-4 w-full sm:max-w-md mx-auto animate-pulse">
                            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                          </Card>
                        ))}
                      </div>
                    ) : filteredTasks.length === 0 ? (
                      <Card
                        className="p-6 text-center animate-fade-in-up w-full sm:max-w-md mx-auto border-dashed"
                        role="region"
                        aria-label="Empty task list"
                      >
                        <CardContent>
                          <CheckCircle2 className="w-12 h-12 mx-auto text-gray-400 mb-4 transition-transform duration-300 hover:scale-110" />
                          <h3 className="text-lg font-medium mb-2">
                            {searchQuery ? "No tasks match your search" : "No tasks yet"}
                          </h3>
                          <p className="text-muted-foreground text-center max-w-sm">
                            {searchQuery ? "Try adjusting your search term." : "Get started by creating your first task. Click the 'Add Task' button above."}
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      <div className="grid gap-4">
                        {filteredTasks.map((task, index) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            onEdit={handleEditTask}
                            onDelete={handleDeleteTask}
                            onToggleComplete={handleToggleComplete}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Instructions Footer */}
            <div className="mt-12 pt-8 border-t border-border">
              <Card className="bg-muted/50">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-3">Getting Started Instructions:</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium mb-2">1. Create TypeScript Interfaces</h4>
                      <p className="text-muted-foreground">Define the Task interface with proper types</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">2. Build TaskCard Component</h4>
                      <p className="text-muted-foreground">Display task info with edit/delete actions</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">3. Implement State Management</h4>
                      <p className="text-muted-foreground">CRUD operations with localStorage persistence</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">4. Create Task Form</h4>
                      <p className="text-muted-foreground">Validated form with error handling</p>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-primary/10 rounded-lg">
                    <p className="text-sm">
                      <strong>💡 Pro tip:</strong> Focus on functionality first, then polish the styling.
                      Use the design system tokens (priority.high, priority.medium, priority.low) for consistent colors.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;