const logUpdate = require('log-update')
const toX = () => 'X'
const delay = (seconds) => new Promise((resolve) => {
    setTimeout(resolve, seconds * 1000)
})

const tasks = [
    delay(5),
    delay(3),
    delay(1),
    delay(6),
    delay(3),
    delay(9),
    delay(10),
    delay(5),
    delay(1)
]

class PromiseQueue {
    /*
        Can Run At least one Task at a time
    */
    constructor(tasks =[], concurrentCount = 1) {
        this.concurrent = concurrentCount
        this.total = tasks.length
        this.todo = tasks
        this.running = []
        this.complete = []
    }

    get runAnother() {
        return (this.running.length < this.concurrent) && this.todo.length
    }

    //For Visuals
    showTasks() {
        const { todo, running, complete } = this
        logUpdate(`
        todo: [${todo.map(toX)}]
        running: [${running.map(toX)}]
        complete: [${complete.map(toX)}]
        
        `)
    }

    /*
        Checks if there are tasks to be ran; If Run another returns true
        Takes a task from the Tasks Stack, waits til it's complete
        pushes another task while waiting the prev task to complete
        When it's done with one task, it re-runs ..til runAnother returns false
    */

    run() {
        while ( this.runAnother ) {
            let task = this.todo.shift()
            task.then(() => {
                this.complete.push(this.running.shift())
                this.showTasks()
                this.run()
            })
            this.running.push(task)
            this.showTasks()
        }

    }
}


const delayQueue = new PromiseQueue(tasks, 2)
delayQueue.run()