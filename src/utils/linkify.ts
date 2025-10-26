export function linkifyText(text: string): string {
  const escapeHtml = (str: string): string => {
    const div = document.createElement('div')
    div.textContent = str
    return div.innerHTML
  }

  const escapedText = escapeHtml(text)
  const urlRegex = /(https?:\/\/[^\s]+)/g

  return escapedText.replace(urlRegex, (url) => {
    return `<a href="${url}" target="_blank" rel="noopener noreferrer" style="color: #1976d2; text-decoration: underline;">${url}</a>`
  })
}
