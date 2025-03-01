import path from "path";
import { PythonShell } from "python-shell";

async function predictOrderTime(
  orderDetails: any
): Promise<number | undefined> {
  return new Promise<number | undefined>((resolve, reject) => {
    const scriptPath = path.join(__dirname, "../ml/predictOrderTime.py");

    const options = {
      mode: "json" as "json",
      pythonOptions: ["-u"],
      scriptPath: path.dirname(scriptPath),
      args: [JSON.stringify(orderDetails)],
    };

    PythonShell.run(
      "predictOrderTime.py",
      options,
      (err: any, results: { predictedTime: any }[]) => {
        if (err) {
          console.error("Prediction script error:", err);
          return reject(err);
        }
        const prediction = results && results[0] && results[0].predictedTime;
        resolve(prediction);
      }
    );
  });
}

export { predictOrderTime };
