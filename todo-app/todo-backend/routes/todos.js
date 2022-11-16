const express = require('express');
const { Todo } = require('../mongo')
const router = express.Router();
const {getAsync, setAsync} = require('../redis')

/* GET todos listing. */
router.get('/', async (_, res) => {
  const todos = await Todo.find({})
  res.send(todos);
});

/* GET statistics of added todos */
router.get('/statistics', async(_, res) => {
  const value = await getAsync('added_todos');
  console.log('check statistics')
  res.send({ "added_todos":value })
});

/* POST todo to listing. */
router.post('/', async (req, res) => {
  console.log(req.body)
  const todo = await Todo.create({
    text: req.body.text,
    done: false
  })
  console.log(todo)
  const soFar = await getAsync('added_todos')
  if(!soFar){
    await setAsync('added_todos',1)
  }
  else{
    await setAsync('added_todos',parseInt(soFar) + 1)
  }
  console.log('nr. of added todos = ', soFar)
  res.send(todo)
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
  const { id } = req.params
  req.todo = await Todo.findById(id)
  if (!req.todo) return res.sendStatus(404)
  next()
}

/* DELETE todo. */
singleRouter.delete('/', async (req, res) => {
  await req.todo.delete()  
  res.sendStatus(200);
});

/* GET todo.*/ 
singleRouter.get('/', async (req, res) => {
  res.send(req.todo);
}); 

/* PUT todo. */
singleRouter.put('/', async (req, res) => {
  console.log(req.todo)
  req.todo.done = req.body.done
  const updatedTodo = await req.todo.save()
  res.send(updatedTodo)
});

router.use('/:id', findByIdMiddleware, singleRouter)

4
module.exports = router;
