import GenerateIcon from "assets/Generate.svg"
import InsertIcon from "assets/Insert.svg"
import RegenerateIcon from "assets/Regenerate.svg"
import React, { useState } from "react"

// Interface for the prompts
interface IPrompts {
  role: string
  message: string
}

// Props for the PromptModal component
interface PromptModalProps {
  open: boolean
  handleClose: () => void
}

// Component to display the prompt modal, generate prompts based on user input, and insert generated prompts into the LinkedIn chat box
const PromptModal: React.FC<PromptModalProps> = ({ open, handleClose }) => {
  const [prompts, setPrompts] = useState<IPrompts[]>([])
  const [userPrompt, setUserPrompt] = useState<string>("")

  // Method to handle the generate button click
  const handleGenerate = (): void => {
    if (userPrompt && userPrompt.length > 0) {
      const data: IPrompts[] = [
        {
          role: "user",
          message: userPrompt
        },
        {
          role: "system",
          message:
            "Thank you for the opportunity! If you have any more questions or if there's anything else I can help you with, feel free to ask."
        }
      ]
      setPrompts((prev) => [...prev, ...data])
    }
    setUserPrompt("")
  }

  // Method to handle the insert button click to insert the generated prompt
  const handleInsert = (): void => {
    const placeHolder = document.querySelector<HTMLElement>(
      ".msg-form__placeholder"
    )
    placeHolder?.remove()
    const textBox = document.querySelector<HTMLElement>(
      ".msg-form__contenteditable"
    )
    if (textBox) {
      textBox.textContent = prompts[prompts.length - 1]?.message || ""

      // Set the cursor at the end of the text box
      const range = document.createRange()
      range.selectNodeContents(textBox)
      range.collapse(false)
      const selection = window.getSelection()
      if (selection) {
        selection.removeAllRanges()
        selection.addRange(range)
      }
    }
    setUserPrompt("")
    setPrompts([])
    handleClose()
  }

  // Rendering the modal dialog box
  return (
    open && (
      <div
        className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50"
        onClick={handleClose}>
        <div
          className="bg-[#F9FAFB] p-4 gap-[8px] flex flex-col w-[350px] shadow-lg rounded-[4px]"
          onClick={(e) => e.stopPropagation()}>
          {/* Loop through the prompts and display them in the modal */}
          {prompts.map((prompt, index) => (
            <div
              key={index}
              className={`w-auto max-w-[250px] rounded-[4px] ${
                prompt.role === "user"
                  ? "self-end text-left"
                  : "self-start text-left"
              } text-sm font-normal text-[#666D80] ${
                prompt.role === "user" ? "bg-[#DFE1E7]" : "bg-[#DBEAFE]"
              } p-4 mb-2`}>
              {prompt.role === "system" ? (
                <>
                  Thank you for the opportunity! If you have any more
                  <br />
                  questions or if there's anything else I can help you
                  <br />
                  with, feel free to ask.
                </>
              ) : (
                prompt.message
              )}
            </div>
          ))}

          {/* Input field to enter the user prompt */}
          <input
            type="text"
            placeholder="Your prompt"
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            className="text-base top-[5px] left-[16px] text-[#666D80] mb-1 p-2 gap-[4px] border-[1px] bg-[#FFFFFF]
          rounded-lg border-[#C1C7D0] self-end w-full"
          />

          {/* Button to generate the prompt */}
          {prompts.length === 0 ? (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleGenerate}
                className="bg-[#3B82F6] text-[#FFFFFF] text-base font-semibold rounded-lg p-2 mt-1 flex justify-center items-center w-32 cursor-pointer">
                <img src={GenerateIcon} alt="icon" className="w-5 h-5 mr-2" />
                <span>Generate</span>
              </button>
            </div>
          ) : (
            // Button to insert the generated prompt
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleInsert}
                className="text-[#666D80] border-[#666D80] border-[2px] text-base font-semibold rounded-lg p-2 mt-1 flex justify-center items-center w-26 cursor-pointer mr-1">
                <img src={InsertIcon} alt="icon" className="w-3 h-4 mr-2" />
                <span>Insert</span>
              </button>

              {/* Non-functional button to regenerate the prompt */}
              <button
                type="button"
                className="bg-[#3B82F6] text-[#FFFFFF] border-[2px] border-[#3B82F6] text-base font-semibold rounded-lg p-2 mt-1 flex justify-center items-center w-36 cursor-pointer">
                <img src={RegenerateIcon} alt="icon" className="w-4 h-5 mr-2" />
                <span>Regenerate</span>
              </button>
            </div>
          )}
        </div>
      </div>
    )
  )
}

export default PromptModal
