interface Props {
  title: string
  buttonLabel: string
  onButtonClick: () => void
}

export default function PageHeader({ title, buttonLabel, onButtonClick }: Props) {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <h4 className="mb-0 fw-semibold">{title}</h4>
      <button className="btn btn-primary btn-sm px-3"  onClick={onButtonClick}>
        {buttonLabel}
      </button>
    </div>
  )
}