const CommonIcons = {
  copy: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="w-5 h-5 text-black"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184"
      />
    </svg>
  ),
  copyDone: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="w-5 h-5 text-black"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M11.35 3.836c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m8.9-4.414c.376.023.75.05 1.124.08 1.131.094 1.976 1.057 1.976 2.192V16.5A2.25 2.25 0 0118 18.75h-2.25m-7.5-10.5H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V18.75m-7.5-10.5h6.375c.621 0 1.125.504 1.125 1.125v9.375m-8.25-3l1.5 1.5 3-3.75"
      />
    </svg>
  ),
  plus: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="w-6 h-6 text-black"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
  "chevron-right": (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 24.0001L20 16.0001L12 8.00012"
        stroke="#515662"
        strokeWidth="2.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  "chevron-down": (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 12L16 20L24 12"
        stroke="#515662"
        strokeWidth="2.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  arrow: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 6L8 10L12 6"
        stroke="#64748B"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  backpack: (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.12"
        d="M2.25 5.78571C2.25 4.58621 2.25 3.98645 2.47282 3.52376C2.69398 3.06452 3.06452 2.69398 3.52376 2.47282C3.98645 2.25 4.58621 2.25 5.78571 2.25H12.2143C13.4138 2.25 14.0135 2.25 14.4762 2.47282C14.9355 2.69398 15.306 3.06452 15.5272 3.52376C15.75 3.98645 15.75 4.58621 15.75 5.78571C15.75 7.38506 15.75 8.18473 15.4529 8.80165C15.158 9.41397 14.664 9.90803 14.0517 10.2029C13.4347 10.5 12.6351 10.5 11.0357 10.5H6.96429C5.36494 10.5 4.56527 10.5 3.94835 10.2029C3.33603 9.90803 2.84197 9.41397 2.54709 8.80165C2.25 8.18473 2.25 7.38506 2.25 5.78571Z"
        fill="#515662"
      />
      <path
        d="M15 9.75V13.35C15 14.1901 15 14.6101 14.8365 14.931C14.6927 15.2132 14.4632 15.4427 14.181 15.5865C13.8601 15.75 13.4401 15.75 12.6 15.75H5.4C4.55992 15.75 4.13988 15.75 3.81901 15.5865C3.53677 15.4427 3.3073 15.2132 3.16349 14.931C3 14.6101 3 14.1901 3 13.35V9.75M6.75 7.5H11.25M6.96429 10.5H11.0357C12.6351 10.5 13.4347 10.5 14.0517 10.2029C14.664 9.90803 15.158 9.41397 15.4529 8.80165C15.75 8.18473 15.75 7.38506 15.75 5.78571C15.75 4.58621 15.75 3.98645 15.5272 3.52376C15.306 3.06452 14.9355 2.69398 14.4762 2.47282C14.0135 2.25 13.4138 2.25 12.2143 2.25H5.78571C4.58621 2.25 3.98645 2.25 3.52376 2.47282C3.06452 2.69398 2.69398 3.06452 2.47282 3.52376C2.25 3.98645 2.25 4.58621 2.25 5.78571C2.25 7.38506 2.25 8.18473 2.54709 8.80165C2.84197 9.41397 3.33603 9.90803 3.94835 10.2029C4.56527 10.5 5.36494 10.5 6.96429 10.5Z"
        stroke="#515662"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  smallArrowRight: (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.33334 7H11.6667M11.6667 7L8.16668 3.5M11.6667 7L8.16668 10.5"
        stroke="#515662"
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
};

export default CommonIcons;
