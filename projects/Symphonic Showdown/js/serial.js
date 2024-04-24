function serialWrite(jsonObject) {
    if (writer) {
      writer.write(encoder.encode(JSON.stringify(jsonObject)+"\n"));
    }
  }
  
  async function serialRead() {
    while(true) {
      const { value, done } = await reader.read();
      if (done) {
        reader.releaseLock();
        break;
      }
      console.log(value);
      sensorData = JSON.parse(value);
    }
  }
  
  async function connect() {
    port = await navigator.serial.requestPort();
  
    await port.open({ baudRate: 38400 });
  
    writer = port.writable.getWriter();
  
    reader = port.readable
      .pipeThrough(new TextDecoderStream())
      .pipeThrough(new TransformStream(new LineBreakTransformer()))
      .getReader();
  }
  
  class LineBreakTransformer {
    constructor() {
      // A container for holding stream data until a new line.
      this.chunks = "";
    }
  
    transform(chunk, controller) {
      // Append new chunks to existing chunks.
      this.chunks += chunk;
      // For each line breaks in chunks, send the parsed lines out.
      const lines = this.chunks.split("\n");
      this.chunks = lines.pop();
      lines.forEach((line) => controller.enqueue(line));
    }
  
    flush(controller) {
      // When the stream is closed, flush any remaining chunks out.
      controller.enqueue(this.chunks);
    }
  }