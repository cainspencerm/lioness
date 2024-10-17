import { LogsTable } from "./components/LogsTable"

export default function Logs() {
  return (
    <div className="prose prose-invert max-w-none">
      <h1>Logs</h1>
      <p>View the logs from the main process here.</p>
      <LogsTable />
    </div>
  )
}
