if(typeof window != "object") {
  self.window = self;
}
let client = null
let pending = []
const invoke = async event => {
  const { id, method, params } = event.data;
  try {
    // console.log("calling", id, method, params)
    const result = await client[method](...params)
    // console.log("result", id, result)
    postMessage({
      id,
      result
    });
  } catch(error) {
    // console.log("got error")
    // console.log(error)
    postMessage({
      id,
      error: error.message,
      stack: error.stack
    })
  }
}

const loadClient = async () => {
  client = (await import("./ClientImporter")).default
  pending.forEach(event => invoke(event))
  pending = []
}
loadClient()



onmessage = function (event) {
  if (client == null) {
    pending.push(event)
  } else {
    invoke(event)
  }
};