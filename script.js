const db = firebase.firestore();

const taskForm = document.querySelector('#task-form');
const taskscontainer = document.querySelector('#tasks-container');

let editStatus = false;
let id = '';

const saveTasks = (title, description) =>
    db.collection('tasks').doc().set({
        title: title,
        description: description
    })

const getTasks = () => db.collection('tasks').get();

const getTask = (id) => db.collection('tasks').doc(id).get();

const onGetTasks = (callback) => db.collection('tasks').onSnapshot(callback);

const deleteTask = id => db.collection('tasks').doc(id).delete();

const updateTask = (id, updateTask) =>
    db.collection('tasks').doc(id).update(updateTask);

window.addEventListener('DOMContentLoaded', async (e) =>{
    onGetTasks((querySnapshot) => {
        taskscontainer.innerHTML = '';
        querySnapshot.forEach(doc => {
            console.log(doc.data());
            const task = doc.data();
            task.id = doc.id;
            taskscontainer.innerHTML += `<div class="card card-body mt-2 border-dark task-container">
                <h4>${task.title}</h4>
                <hr>
                <p>${task.description}</p>
            <div>
                <button class="btn btn-outline-success btn-edit" data-id="${task.id}">Editar</button>
                <button class="btn btn-outline-danger btn-delete" data-id="${task.id}">Eliminar</button>
            </div>
            </div>`;

        const btnsDelete = document.querySelectorAll('.btn-delete');
        btnsDelete.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                await deleteTask(e.target.dataset.id);
            })
        })

        const btnsEdit = document.querySelectorAll('.btn-edit');
        btnsEdit.forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const doc = await getTask(e.target.dataset.id);
                const task = doc.data();

                editStatus = true;
                id = doc.id;
                
                taskForm['task-title'].value = task.title;
                taskForm['task-description'].value = task.description;
                taskForm['save-task'].innerText = 'Actualizar';
            })
         })
        })
    })
})

taskForm.addEventListener('submit', async (e) =>{
    e.preventDefault();

    const title = taskForm['task-title'];
    const description = taskForm['task-description'];

    if(!editStatus){
        await saveTasks(title.value, description.value);
    }else{
        await updateTask(id, {
            title : title.value,
            description : description.value
        });

        editStatus = false;
        id = '';
        taskForm['save-task'].innerText = 'Guardar';
    }
    await getTasks();

    taskForm.reset();
    title.focus();
})