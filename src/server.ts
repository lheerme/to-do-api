import fastify from "fastify";

const app = fastify();

app.listen({ port: 8080 }, (error) => {
	if (error) {
		console.log(error);
		process.exit(1);
	}

	console.log("Server listening on 8080");
});
