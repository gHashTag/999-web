interface Props {
  className: string;
}

export function PaperAirplaneIcon({ className }: Props) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className}>
      <path
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M17 3L1 9L8 12M17 3L11 19L8 12M17 3L8 12"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11 19L8 12L17 3L11 19Z"
      />
    </svg>
  );
}
