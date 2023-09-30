interface MessageFormProps {
  action: (formData: FormData) => void
}

export const MessageForm = ({ action }: MessageFormProps) => {
  return (
    <form action={action}>
      <input type="text" name="message" />
      <button type="submit">Send</button>
    </form>
  )
}
