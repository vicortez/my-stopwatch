import { ChangeEvent, useState } from 'react'

export interface FormValue {
  sessionCode: string
}
interface IProps {
  isOpen: boolean
  initialFormValue: FormValue
  onCancel: () => void
  onSubmit: ({ sessionCode }: FormValue) => void
}
export const OptionsModal: React.FC<IProps> = ({
  isOpen,
  initialFormValue,
  onCancel,
  onSubmit
}: IProps) => {
  const [formValue, setFormValue] = useState<FormValue>(initialFormValue)

  if (!isOpen) {
    return <></>
  }
  function handleOnChangeSessionCode(event: ChangeEvent<HTMLInputElement>): void {
    setFormValue((oldState) => ({ ...oldState, sessionCode: event.target.value }))
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={() => onCancel()}
    >
      <div
        className="bg-neutral-800 p-6 rounded-lg shadow-lg max-w-sm w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">Options</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Stopwatch Code</label>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter stopwatch code"
            value={formValue.sessionCode}
            onChange={handleOnChangeSessionCode}
            maxLength={5}
          />
        </div>

        <div className="flex gap-2 justify-end">
          <button
            onClick={() => onCancel()}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(formValue)}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}
