import ClientWorker from "./Client.worker.js"
const worker = new ClientWorker()
const _awaitingResolve = {}
let _id = 0
const getId = () => _id++

worker.addEventListener("message", event => {
	const { id, result, error, stack } = event.data
	if (error == null) {
		_awaitingResolve[id].resolve(result)
	} else {
		const errorObj = new Error(error)
		errorObj.stack = stack
		_awaitingResolve[id].reject(errorObj)
	}
})

export const rawCall = (method, params) => {
	const id = getId()
	const promise = new Promise((resolve, reject) => {
		_awaitingResolve[id] = { resolve, reject }
		worker.postMessage({ id, method, params })
	})

	return promise
}

const nullFn = function(){}

export default new Proxy({}, {
	get(target, prop) {
		return new Proxy(nullFn, {
			apply(target, thisArg, params) {
				return rawCall(prop, params)
			}
		})
	}
})