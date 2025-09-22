import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Circle, Clock, Edit, Trash2 } from "lucide-react";
import { Task } from '../types/Task';

// TypeScript interfaces
interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
}

const TaskCard = ({ task, onEdit, onDelete, onToggleComplete }: TaskCardProps) => {
  // Priority-based styling
  const priorityStyles = {
    High: { bg: 'border-red-200 bg-red-50', badge: 'bg-red-100 text-red-800' },
    Medium: { bg: 'border-yellow-200 bg-yellow-50', badge: 'bg-yellow-100 text-yellow-800' },
    Low: { bg: 'border-blue-200 bg-blue-50', badge: 'bg-blue-100 text-blue-800' },
  };

  // Due date formatting
  const dueDate = new Date(task.dueDate);
  const isOverdue = dueDate < new Date() && !task.completed;
  const dueInfo = {
    text: dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    className: isOverdue ? 'text-red-600' : 'text-gray-600',
  };

  return (
    <Card className={`p-4 transition-all duration-200 hover:shadow-md w-full max-w-md mx-auto
      ${task.completed ? 'bg-gray-50 border-gray-200 opacity-75' : priorityStyles[task.priority].bg}
      ${task.completed ? '' : 'hover:shadow-lg hover:scale-[1.02]'}`}>
      <div className="relative">
        {/* Completion Status Indicator */}
        <div className="absolute top-0 right-0 flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onToggleComplete(task.id)}
            className="p-1 rounded-full hover:bg-white/50"
            title={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
            aria-label={task.completed ? 'Mark task as incomplete' : 'Mark task as complete'}
          >
            {task.completed ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400 hover:text-gray-600" />
            )}
          </Button>
        </div>

        {/* Priority Badge */}
        <div className="flex items-start justify-between mb-3">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
            ${priorityStyles[task.priority].badge}`}>
            {task.priority} Priority
          </span>
        </div>

        {/* Task Title */}
        <h3 className={`text-lg font-semibold mb-2 pr-8
          ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
          {task.title || 'Untitled Task'}
        </h3>

        {/* Task Description */}
        <p className={`text-sm mb-3 line-clamp-2
          ${task.completed ? 'text-gray-400' : 'text-gray-600'}`}>
          {task.description || 'No description provided'}
        </p>

        {/* Due Date */}
        <div className="flex items-center mb-4">
          <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
          <span className={`text-xs font-medium ${task.completed ? 'text-gray-400' : dueInfo.className}`}>
            {dueInfo.text}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 pt-2 border-t border-gray-200">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(task)}
            className="flex items-center text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            aria-label={`Edit task ${task.title}`}
          >
            <Edit className="w-4 h-4 mr-1.5" />
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task.id)}
            className="flex items-center text-red-600 hover:text-red-700 hover:bg-red-50"
            aria-label={`Delete task ${task.title}`}
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            Delete
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;