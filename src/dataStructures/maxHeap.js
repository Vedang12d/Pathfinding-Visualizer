/* Priority Queue only implements necessary functions that will be used
   Dijkstra's algorithm implementation uses a min heap */

   class HeapEntry {
    constructor(data, priority) {
        this.data = data;
        this.priority = priority;
    }
}

export default class MinHeap {
    constructor() {
        this.items = [];
    }

    show() {
        return this.items;
    }

    isEmpty() {
        return this.items.length === 0;
    }

    enqueue(data, priority) {
        const entry = new HeapEntry(data, priority);
        let entryAdded = false;

        for (let i = this.items.length - 1; i >= 0; i--) {
            if (this.items[i].priority > entry.priority) {
                this.items.splice(i, 0, entry);
                entryAdded = true;
                break;
            }
        }
        //Add lowest priority entry or first entry in an empty array
        !entryAdded && this.items.push(entry);
    }

    dequeue() {
        if (!this.isEmpty()) {
            //Remove first item
            return this.items.shift().data;
        }
    }
}