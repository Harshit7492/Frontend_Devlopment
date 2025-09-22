import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TaskFormData } from '../types/Task';
import { Loader2 } from "lucide-react";

interface TaskFormProps {
  onSubmit: (task: TaskFormData) => void;
  onCancel?: () => void;
  initialTask?: TaskFormData;
  isEditing?: boolean;
}

export const TaskForm = ({ onSubmit, onCancel, initialTask, isEditing = false }: TaskFormProps) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<TaskFormData>({
    defaultValues: initialTask || {
      title: '',
      description: '',
      priority: 'Low',
      dueDate: new Date().toISOString().split('T')[0],
    },
  });

  const onSubmitForm = async (data: TaskFormData) => {
    await new Promise(resolve => setTimeout(resolve, 500)); 
    onSubmit(data);
    if (!isEditing) {
      reset({
        title: '',
        description: '',
        priority: 'Low',
        dueDate: new Date().toISOString().split('T')[0],
      });
    }
  };

  return (
    <Card className="mb-6 w-full max-w-md mx-auto animate-fade-in-up shadow-md transition-all duration-300">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          {isEditing ? 'Edit Task' : 'Add New Task'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-4">
          {/* Title Field */}
          <div>
            <label htmlFor="title" className="text-sm font-medium text-gray-200">
              Title <span className="text-red-400">*</span>
            </label>
            <Input
              id="title"
              {...register('title', {
                required: 'Task title is required',
                maxLength: {
                  value: 100,
                  message: 'Title must be 100 characters or less',
                },
              })}
              placeholder="Task title..."
              aria-required="true"
              aria-describedby={errors.title ? 'title-error' : undefined}
              className={`
        mt-1 shadow-sm rounded-lg bg-gray-800 text-gray-100 border-gray-700
        transition-all duration-200 hover:shadow-md focus:ring-2 focus:ring-blue-500
        ${errors.title ? 'border-red-400' : ''}
      `}
            />
            {errors.title && (
              <p id="title-error" className="text-red-400 text-sm mt-1 animate-fade-in">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Description Field */}
          <div>
            <label htmlFor="description" className="text-sm font-medium text-gray-200">
              Description
            </label>
            <textarea
              id="description"
              {...register('description', {
                maxLength: {
                  value: 500,
                  message: 'Description must be 500 characters or less',
                },
              })}
              placeholder="Task description..."
              className={`
        w-full p-3 mt-1 border rounded-lg bg-gray-800 text-gray-100 border-gray-700
        shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200
        hover:shadow-md hover:scale-[1.01] ${errors.description ? 'border-red-400' : ''}
      `}
              rows={3}
              aria-label="Task description"
              aria-describedby={errors.description ? 'description-error' : undefined}
            />
            {errors.description && (
              <p id="description-error" className="text-red-400 text-sm mt-1 animate-fade-in">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Priority Field */}
          <div>
            <label htmlFor="priority" className="text-sm font-medium text-gray-200">
              Priority
            </label>
            <select
              id="priority"
              {...register('priority')}
              className={`
        w-full p-3 mt-1 border rounded-lg bg-gray-800 text-gray-100 border-gray-700
        shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200
        hover:shadow-md hover:scale-[1.01]
      `}
              aria-label="Task priority"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Due Date Field */}
          <div>
            <label htmlFor="dueDate" className="text-sm font-medium text-gray-200">
              Due Date
            </label>
            <Input
              id="dueDate"
              type="date"
              {...register('dueDate')}
              className={`
        mt-1 shadow-sm rounded-lg bg-gray-800 text-gray-100 border-gray-700
        transition-all duration-200 hover:shadow-md focus:ring-2 focus:ring-blue-500
      `}
              aria-label="Task due date"
            />
          </div>

          {/* Form Actions */}
          <div className="flex gap-2">
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm rounded-lg transition-all duration-200 hover:scale-105"
              aria-label={isEditing ? 'Save edited task' : 'Add new task'}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : null}
              {isEditing ? 'Save Task' : 'Add Task'}
            </Button>
            {isEditing && onCancel && (
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="shadow-sm rounded-lg border-gray-700 text-gray-100 hover:bg-gray-700 transition-all duration-200 hover:scale-105"
                aria-label="Cancel editing"
              >
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};