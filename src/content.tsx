import AiIcon from "assets/ai-icon.svg"
import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import React, { useEffect, useState } from "react"

import PromptModal from "~features/PromptModal"

// Configuration for Plasmo Content Script
export const config: PlasmoCSConfig = {
  matches: ["https://*.linkedin.com/*"] // Match LinkedIn URLs
}

// Inject CSS styles
export const getStyle = (): HTMLStyleElement => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const Content: React.FC = () => {
  const [showModal, setShowModal] = useState<boolean>(false)

  // Checking for the text box availability every second
  // Once the text box is found, add the AI icon and stop checking

  const handleMutation = (
    mutations: MutationRecord[],
    observer: MutationObserver
  ) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length > 0) {
        const textBox = document.querySelector<HTMLElement>(
          ".msg-form__contenteditable"
        )
        if (textBox) {
          textBox.addEventListener("focus", handleFocus)
          textBox.addEventListener("blur", handleBlur)
          observer.disconnect() // Stop observing once the class is found
        }
      }
    })
  }

  useEffect(() => {
    const observer = new MutationObserver(handleMutation)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => observer.disconnect() // Clean up on unmount
  }, [])

  // Handle focus event on the text box to add the AI icon
  const handleFocus = (): void => {
    const textBox = document.querySelector<HTMLElement>(
      ".msg-form__contenteditable"
    )
    if (textBox) {
      // Create the AI icon and append it to the text box
      const container = document.createElement("div")
      container.className = "ai-icon"
      container.setAttribute("style", "position:absolute; bottom:0; right:5px;")

      const imgElement = document.createElement("img")
      imgElement.src = AiIcon
      imgElement.alt = "ai-icon"
      imgElement.setAttribute(
        "style",
        "width: 32px; height: 32px; cursor:pointer;"
      )
      imgElement.addEventListener("click", () => setShowModal(true))

      container.appendChild(imgElement)
      textBox.appendChild(container)
    }
  }

  // Handle blur event on the text box to remove the AI icon
  const handleBlur = (): void => {
    const textBox = document.querySelector<HTMLElement>(
      ".msg-form__contenteditable"
    )
    const container = textBox?.querySelector<HTMLElement>(".ai-icon")
    container?.remove()
  }

  // Render the PromptModal component when showModal is true to show the modal dialog box when the AI icon is clicked in the text box on LinkedIn messages page
  return (
    <>
      <PromptModal open={showModal} handleClose={() => setShowModal(false)} />
    </>
  )
}

export default Content
