type LogoProps = {
  size: number;
};

function Logo({ size }: LogoProps) {
  return (
    <svg
      style={{
        width: 200 * size,
        height: 200 * size,
      }}
      width="200"
      height="200"
      viewBox="0 0 317 317"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 217H100V317H50C22.3858 317 0 294.614 0 267V217Z"
        fill="#FF5C00"
      />
      <rect y="108.896" width="100" height="100" fill="#FF6C1B" />
      <path
        d="M0 50.792C0 23.1778 22.3858 0.791992 50 0.791992H100V100.792H0V50.792Z"
        fill="#FF7E35"
      />
      <rect x="108.104" y="217" width="100" height="100" fill="#EC5400" />
      <rect x="108.104" y="108.896" width="100" height="100" fill="#FF5C00" />
      <rect x="108.104" y="0.791992" width="100" height="100" fill="#FF6C1B" />
      <path
        d="M216.208 217H316.208V267C316.208 294.614 293.822 317 266.208 317H216.208V217Z"
        fill="#CE4A00"
      />
      <rect x="216.208" y="108.896" width="100" height="100" fill="#EC5400" />
      <path
        d="M216.208 0.791992H266.208C293.822 0.791992 316.208 23.1778 316.208 50.792V100.792H216.208V0.791992Z"
        fill="#FF5C00"
      />
    </svg>
  );
}

export default Logo;
