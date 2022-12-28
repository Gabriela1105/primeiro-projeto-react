import { useState } from 'react';
import './styles/global.scss';
import styles from './App.module.scss'

import {Header} from './components/Header';
import { ClipboardText, Plus } from 'phosphor-react'
import { Task } from './components/Task';

function App() {
  const [taskText, setTasksText] = useState('');
  const [tasks, setTasks] = useState(() => {
    const localTasks = localStorage.getItem('@AfroToDo:tasks');

    return JSON.parse(localTasks) || [];
  });

  const doneCount = tasks.reduce((acc, task) => {
    return task.done ? acc += 1 : acc;
  }, 0);

  function handleSubmit(event){
    event.preventDefault();

    const newTask = {
      id: Date.now(),
      content: taskText,
      done:false
    }
    const newTasks = [...tasks, newTask]
    localStorage.setItem('@AfroToDo:tasks', JSON.stringify(newTasks));

    setTasks(newTasks)
    setTasksText('');
  }

  function handleChangeInput(event){
    setTasksText(event.currentTarget.value);
  }

  function handleToggleTask(id){
    const updatedTask = tasks.map(task =>{
      return task.id == id ? { ...task, done: !task.done} : task;
    })
    localStorage.setItem('@AfroToDo:tasks',JSON.stringify(updatedTask));
    setTasks(updatedTask);
  }

  function handleRemoveTask(id){
    const filteredTask = tasks.filter( task => {
      return task.id !== id;
    });
    localStorage.setItem('@AfroToDo:tasks',JSON.stringify(filteredTask));
    setTasks(filteredTask);
  }

  return (
    <>
      <Header />
      <main className={styles.container}>
        <form className={styles.addTaskForm} onSubmit={handleSubmit}>
          <input 
          type="text" 
          placeholder="Insira uma nova atividade" 
          value={taskText} 
          onChange={handleChangeInput} 
          />
          <button><Plus /></button>
        </form>

        {tasks.length ? (
        <>
        <h3 className={styles.status}>Tarefas concluídas<span>{doneCount} de {tasks.length}</span></h3>

        <ul className={styles.TaskList}>
          {tasks.map(task => (
          <Task 
            key={task.id}
            content={task.content}
            isDone={task.done} 
            onCheck={() => handleToggleTask(task.id)}
            onRemove={() => handleRemoveTask(task.id)}
          />
        ))}
        </ul> 
        </>
        ) : (
           <div className={styles.empty}>
              <ClipboardText />
              <p>Você não tem nenhuma tarefa no momento.</p>
              <span> Adicione novas tarefas para que elas sejam mostradas.</span>
          </div>
          )}
      </main>
    </>
  )
}

export default App
