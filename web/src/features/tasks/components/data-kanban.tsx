import {
  DragDropContext,
  Draggable,
  Droppable,
  type DropResult,
} from "@hello-pangea/dnd";
import { useCallback, useState } from "react";

import { TaskStatus, TTask } from "@/types/tasks";

import { KanbanColumnHeader } from "./kanban-column-header";
import { KanbanCard } from "./KanbanCard";

export type TasksByStatus = {
  [TaskStatus.BACKLOG]: TTask[];
  [TaskStatus.TODO]: TTask[];
  [TaskStatus.IN_PROGRESS]: TTask[];
  [TaskStatus.IN_REVIEW]: TTask[];
  [TaskStatus.DONE]: TTask[];
};
type UpdatedTask = {
  id: string;
  status: TaskStatus;
  position: number;
};

type DataKanbanProps = {
  data: {
    tasks: TasksByStatus;
  };
  onChange: (task: UpdatedTask) => void;
};

type TasksState = {
  [key in TaskStatus]: TTask[];
};

const boards: TaskStatus[] = [
  TaskStatus.BACKLOG,
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE,
];

const POSITION_STEP = 65536;
const POSITION_DIVIDER = 2;

export const DataKanban = ({ data, onChange }: DataKanbanProps) => {
  const [tasks, setTasks] = useState<TasksState>(data.tasks);

  const calculateNewPosition = useCallback(
    (destinationIndex: number, destinationColumn: TTask[]): number => {
      const before = destinationColumn[destinationIndex - 1];
      const after = destinationColumn[destinationIndex];

      if (!before && !after) return POSITION_STEP;
      if (!before) return after.position / POSITION_DIVIDER;
      if (!after) return before.position + POSITION_STEP;
      return (before.position + after.position) / POSITION_DIVIDER;
    },
    []
  );

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      const { source, destination } = result;
      const sourceStatus = source.droppableId as TaskStatus;
      const destStatus = destination.droppableId as TaskStatus;

      setTasks((prevTasks) => {
        const newTasks = { ...prevTasks };
        const sourceColumn = [...newTasks[sourceStatus]];
        const [movedTask] = sourceColumn.splice(source.index, 1);

        if (!movedTask) return prevTasks;

        const updatedMovedTask = { ...movedTask, status: destStatus };
        newTasks[sourceStatus] = sourceColumn;

        const destColumn = [...newTasks[destStatus]];
        const newPosition = calculateNewPosition(destination.index, destColumn);
        updatedMovedTask.position = newPosition;

        destColumn.splice(destination.index, 0, updatedMovedTask);
        newTasks[destStatus] = destColumn;

        onChange({
          id: updatedMovedTask.id,
          status: destStatus,
          position: newPosition,
        });

        return newTasks;
      });
    },
    [calculateNewPosition, onChange]
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex overflow-x-auto">
        {boards.map((board) => {
          return (
            <div
              key={board}
              className="flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px]"
            >
              <KanbanColumnHeader
                board={board}
                taskCount={tasks[board].length}
              />
              <Droppable droppableId={board}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-[200px] py-1.5"
                  >
                    {tasks[board].map((task, index) => (
                      <Draggable
                        key={task.id}
                        index={index}
                        draggableId={task.id.toString()}
                      >
                        {(provided) => (
                          <div
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                          >
                            <KanbanCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};
