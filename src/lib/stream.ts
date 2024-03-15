export function iteratorToStream<T>(iterator: AsyncGenerator<T>) {
    return new ReadableStream({
        async pull(controller) {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            const { value, done } = await iterator.next();

            if (done) {
                controller.close()
            } else {
                controller.enqueue(value)
            }
        },
    })
}

