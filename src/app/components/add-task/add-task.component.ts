import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task/services.service';
import { ChangeDetectorRef } from '@angular/core';

interface Task {
  id: string;
  name: string;
  done: boolean;
  pinned: boolean;
  category: string;
  createdAt: Date;
  dueDate?: Date;
  dueDateTime?: string;
  priority: 'High' | 'Medium' | 'Low' | 'None';
  subtasks: Task[];
  isAddingSubtask: boolean;
  newSubtaskName?: string;
}

@Component({
  selector: 'app-add-task',
  imports: [FormsModule, CommonModule],
  standalone: true,
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})

export class AddTaskComponent implements OnInit, OnChanges {
  @Input() categoryName: string = '';
  @Input() isActive: boolean = false;
  @Output() closeCategory = new EventEmitter<void>();

  newTaskName: string = '';
  newTaskPriority: 'High' | 'Medium' | 'Low' | 'None' = 'None';
  selectedDate: string = '';
  selectedTime: string = '';
  tasks: Task[] = [];
  isLoading: boolean = false;
  minDate: string = '';
  showDatePicker: boolean = false;
  todayDate: string = new Date().toISOString().split('T')[0];

  constructor(private taskService: TaskService,private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.setMinDate();
    this.loadTasks();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['categoryName'] && !changes['categoryName'].firstChange) {
      this.loadTasks();
    }
  }

  private setMinDate() {
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  private generateTaskId(): string {
    return `${Date.now()}-${Math.floor(Math.random() * 1000)}`;
  }

  private isPriority(priority: any): priority is 'High' | 'Medium' | 'Low' | 'None' {
    return ['High', 'Medium', 'Low', 'None'].includes(priority);
  }

  private normalizeTask(task: any): Task {
    return {
      id: task.id || this.generateTaskId(),
      name: task.name || '',
      done: task.done || false,
      pinned: task.pinned || false,
      category: task.category || this.categoryName,
      createdAt: task.createdAt || new Date(),
      dueDate: task.dueDate,
      dueDateTime: task.dueDateTime,
      priority: this.isPriority(task.priority) ? task.priority : 'None',
      subtasks: task.subtasks 
        ? task.subtasks.map((subtask: any) => this.normalizeTask(subtask))
        : [],
      isAddingSubtask: false,
      newSubtaskName: ''
    };
  }

  private loadTasks() {
    this.isLoading = true;
    this.tasks = [];
    
    setTimeout(() => {
      const loadedTasks = this.taskService.getTasks(this.categoryName);
      this.tasks = loadedTasks
        .filter(task => task.category === this.categoryName)
        .map(task => this.normalizeTask(task));
      this.isLoading = false;
    }, 100);
  }

  private saveTasks() {
      console.log('Saving tasks:', this.tasks);

    const tasksToSave = this.tasks.filter(task => task.category === this.categoryName);
    this.taskService.saveTasks(this.categoryName, tasksToSave);
  }

  get activeTasks(): Task[] {
    return this.tasks
      .filter(task => !task.done && task.category === this.categoryName)
      .sort((a, b) => {
        const priorityOrder = { 'High': 0, 'Medium': 1, 'Low': 2, 'None': 3 };
        if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        if (a.pinned !== b.pinned) {
          return a.pinned ? -1 : 1;
        }
        if (a.dueDate && !b.dueDate) return -1;
        if (!a.dueDate && b.dueDate) return 1;
        if (a.dueDate && b.dueDate) {
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        return 0;
      });
  }

  get completedTasks(): (Task & { isSubtask?: boolean, parentTaskName?: string })[] {
    const completed: (Task & { isSubtask?: boolean, parentTaskName?: string })[] = [];
    
    this.tasks
      .filter(task => task.done && task.category === this.categoryName)
      .forEach(task => completed.push({ ...task, isSubtask: false }));

    this.tasks.forEach(task => {
      if (task.subtasks) {
        task.subtasks
          .filter(subtask => subtask.done)
          .forEach(subtask => completed.push({ 
            ...subtask, 
            isSubtask: true,
            parentTaskName: task.name
          }));
      }
    });

    return completed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  toggleDatePicker() {
    this.showDatePicker = !this.showDatePicker;
  }

  addTask() {
    if (this.newTaskName.trim()) {
      const newTask: Task = {
        id: this.generateTaskId(),
        name: this.newTaskName.trim(),
        done: false,
        pinned: false,
        category: this.categoryName,
        createdAt: new Date(),
        priority: this.newTaskPriority,
        subtasks: [],
        isAddingSubtask: false
      };

      if (this.selectedDate) {
        let dateTimeString = this.selectedDate;
        if (this.selectedTime) {
          dateTimeString += `T${this.selectedTime}`;
        } else {
          dateTimeString += 'T23:59';
        }
        newTask.dueDate = new Date(dateTimeString);
        newTask.dueDateTime = dateTimeString;
      }

      this.tasks.push(newTask);
      this.newTaskName = '';
      this.newTaskPriority = 'None';
      this.selectedDate = '';
      this.selectedTime = '';
      this.saveTasks();
    }
  }

  toggleAddSubtask(task: Task) {
    this.tasks.forEach(t => {
      t.isAddingSubtask = false;
      if (t.subtasks) {
        t.subtasks.forEach(st => st.isAddingSubtask = false);
      }
    });
    task.isAddingSubtask = !task.isAddingSubtask;
    task.newSubtaskName = '';
  }

  addSubtask(task: Task) {
    if (task.newSubtaskName?.trim()) {
      if (!task.subtasks) {
        task.subtasks = [];
      }
      task.subtasks.push({
        id: this.generateTaskId(),
        name: task.newSubtaskName.trim(),
        done: false,
        pinned: false,
        category: this.categoryName,
        createdAt: new Date(),
        priority: 'None',
        subtasks: [],
        isAddingSubtask: false
      });
      task.isAddingSubtask = false;
      task.newSubtaskName = '';
      this.saveTasks();
    }
  }

  deleteSubtask(parentTask: Task, subtaskId: string) {
    parentTask.subtasks = parentTask.subtasks.filter(t => t.id !== subtaskId);
    this.saveTasks();
  }

  updateTaskPriority(task: Task, priority: 'High' | 'Medium' | 'Low' | 'None') {
    task.priority = priority;
    this.saveTasks();
  }

  toggleTaskDone(task: Task, isSubtask: boolean = false) {
    console.log('Toggling task:', task.name, 'isSubtask:', isSubtask, 'current done:', task.done);
    
    this.tasks = this.tasks.map(parentTask => {
      if (isSubtask) {
        const updatedSubtasks = parentTask.subtasks.map(subtask => {
          if (subtask.id === task.id) {
            return { ...subtask, done: !subtask.done };
          }
          return subtask;
        });
        return { ...parentTask, subtasks: updatedSubtasks };
      }
      
      if (parentTask.id === task.id) {
        const newDoneState = !parentTask.done;
        
        if (newDoneState) {
          const updatedSubtasks = parentTask.subtasks.map(subtask => ({
            ...subtask,
            done: true
          }));
          return { ...parentTask, done: newDoneState, subtasks: updatedSubtasks };
        } 
        else {
          const updatedSubtasks = parentTask.subtasks.map(subtask => ({
            ...subtask,
            done: false
          }));
          return { ...parentTask, done: newDoneState, subtasks: updatedSubtasks };
        }
      }
      
      return parentTask;
    });

    this.cdr.detectChanges();
    
    this.saveTasks();
    
    console.log('Updated tasks:', this.tasks);
  }

  pinTask(task: Task) {
    task.pinned = !task.pinned;
    this.saveTasks();
  }

  deleteTask(task: Task & { isSubtask?: boolean }) {
    if (task.isSubtask) {
      this.tasks.forEach(parentTask => {
        if (parentTask.subtasks) {
          parentTask.subtasks = parentTask.subtasks.filter(t => t.id !== task.id);
        }
      });
    } else {
      this.tasks = this.tasks.filter(t => t.id !== task.id);
    }
    this.saveTasks();
  }

  openEditDialog(task: Task) {
    const newName = prompt('Edit task name:', task.name);
    if (newName !== null && newName.trim()) {
      task.name = newName.trim();
      this.saveTasks();
    }
  }

  formatDate(date: Date | undefined): string {
    if (!date) return '';
  
    const taskDate = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const taskDateOnly = new Date(taskDate.getFullYear(), taskDate.getMonth(), taskDate.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const tomorrowOnly = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
    
    let timeString = '';
    if (taskDate.getHours() !== 23 || taskDate.getMinutes() !== 59) {
      timeString = taskDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }
    
    if (taskDateOnly.getTime() === todayOnly.getTime()) {
      return timeString ? `Today, ${timeString}` : 'Today';
    } else if (taskDateOnly.getTime() === tomorrowOnly.getTime()) {
      return timeString ? `Tomorrow, ${timeString}` : 'Tomorrow';
    } else if (taskDate < today) {
      return timeString ? `Overdue (${taskDate.toLocaleDateString()} ${timeString})` : 'Overdue';
    } else {
      const dateString = taskDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: taskDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
      return timeString ? `${dateString}, ${timeString}` : dateString;
    }
  }

  close() {
    this.closeCategory.emit();
  }

  clearTasks() {
    this.tasks = [];
    this.newTaskName = '';
    this.newTaskPriority = 'None';
    this.selectedDate = '';
    this.selectedTime = '';
  }
}