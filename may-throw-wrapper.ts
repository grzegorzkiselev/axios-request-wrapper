import axios from "axios";

const onNetworkError = (error) => {
  console.error("NETWORK ERROR", error instanceof Error ? error.message : error);
};

const roulette = (item) => {
  const youReDead = Math.floor(Math.random() * 6) === 0;

  if (youReDead) {
    throw new Error("Bad luck on item with title " + item.title + " :—(");
  }

  return item.title;
};

axios.get("https://jsonplaceholder.typicode.com/todos")
  .catch(onNetworkError)
  .then(({ data }) => {
    try {
      data.map(roulette);
    } catch(error) {
      console.error("MAPPING ERROR", error instanceof Error ? error.message : error);
    }
  });