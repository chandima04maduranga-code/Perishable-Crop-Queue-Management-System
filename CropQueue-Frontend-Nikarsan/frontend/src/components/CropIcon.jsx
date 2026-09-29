// Small code-native illustrations keep crop names easy to scan at any size.
export default function CropIcon({ name = "", large = false }) {
  const value = name.toLowerCase();
  let type = "leaf";
  if (/brinjal|eggplant|wambatu|கத்தரி/.test(value)) type = "brinjal";
  else if (/chill?i|miris|pepper/.test(value)) type = "chilli";
  else if (/okra|ladies|lady.?s|bandakka/.test(value)) type = "okra";
  else if (/bitter|karawila|gourd|snake/.test(value)) type = "gourd";
  else if (/tomato|தக்காளி/.test(value)) type = "tomato";
  else if (/carrot/.test(value)) type = "carrot";
  else if (/bean/.test(value)) type = "bean";
  else if (/pumpkin|wattakka/.test(value)) type = "pumpkin";
  return (
    <span
      className={`crop-art crop-art-${type} ${large ? "large" : ""}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 64 64" fill="none">
        {type === "brinjal" && (
          <>
            <path
              d="M44 19C48 25 45 36 36 45 27 54 13 57 10 47 7 36 25 25 34 22Z"
              fill="#632575"
            />
            <path
              d="M36 24C23 34 14 40 15 46"
              stroke="#a858b8"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path d="m36 25-3-7 8 1 4-7 4 8 6 1-8 8-3-5-5 6Z" fill="#54a423" />
            <path
              d="M46 17c1-7 6-10 11-10"
              stroke="#28782b"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </>
        )}
        {type === "tomato" && (
          <>
            <path
              d="M55 37c0 13-10 21-23 19S9 48 9 34c0-10 10-15 20-12 13-8 26 2 26 15Z"
              fill="#ed4a39"
            />
            <path
              d="M18 33c0-4 4-7 8-7"
              stroke="#ff9381"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path
              d="m32 17-11-4 5 10-11 5 15-2 8 8-1-11 12-5-13 1Z"
              fill="#4b9828"
            />
            <path
              d="M32 21 35 9"
              stroke="#37782b"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </>
        )}
        {type === "carrot" && (
          <>
            <path d="M18 21c8-7 22 1 23 9L17 58c-3 4-8 0-6-5Z" fill="#f38c2d" />
            <path
              d="m17 34 9 4m-12 7 7 3"
              stroke="#d46716"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M32 24C25 9 32 5 34 8l3 10C44 1 48 4 45 12L40 23c15-13 19-7 10-1l-10 8Z"
              fill="#51a533"
            />
          </>
        )}
        {type === "chilli" && (
          <>
            <path
              d="M48 20c-2 19-18 35-37 29 12-1 20-10 23-20 3-11 9-15 14-9Z"
              fill="#34a345"
            />
            <path
              d="M40 24c-4 11-9 16-15 20"
              stroke="#a4db48"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M44 20c-1-9 3-13 11-13"
              stroke="#286a26"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </>
        )}
        {type === "okra" && (
          <>
            <path d="m12 54 14-33 11-8 10 7-4 15-28 23Z" fill="#4fa434" />
            <path
              d="m17 50 22-30M23 46l18-23"
              stroke="#a6d34e"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path d="m36 17 8-11 9 8-10 9Z" fill="#297b36" />
          </>
        )}
        {type === "gourd" && (
          <>
            <path
              d="M19 48c-10-14 5-35 20-36 12 0 17 11 9 25-8 17-19 23-29 11Z"
              fill="#418c28"
            />
            <path
              d="M23 46c-3-12 8-27 16-28M29 48c1-12 8-20 13-27"
              stroke="#84bd39"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {[
              [21, 35],
              [30, 23],
              [43, 29],
              [36, 43],
            ].map(([cx, cy]) => (
              <circle key={cx} cx={cx} cy={cy} r="3" fill="#94c845" />
            ))}
            <path
              d="M43 14c2-6 7-8 12-7"
              stroke="#387129"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </>
        )}
        {type === "bean" && (
          <>
            <path
              d="M15 49c1-9 9-16 21-24L48 11c9 8 0 22-9 28-10 6-16 9-20 15Z"
              fill="#409848"
            />
            <path
              d="M20 48c7-9 17-11 26-26"
              stroke="#a5d571"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </>
        )}
        {type === "pumpkin" && (
          <>
            <ellipse cx="32" cy="36" rx="24" ry="20" fill="#f29430" />
            <ellipse cx="32" cy="36" rx="14" ry="20" fill="#ffa944" />
            <path
              d="M31 56V20M33 19c-2-9 0-12 4-14"
              stroke="#ad651c"
              strokeWidth="4"
              strokeLinecap="round"
            />
            <path d="M37 16c8-6 13-2 13-2-3 7-9 8-15 5" fill="#589e33" />
          </>
        )}
        {type === "leaf" && (
          <>
            <path d="M31 37C8 39 5 21 15 12c17 0 24 12 16 25Z" fill="#8abd38" />
            <path
              d="M33 45C26 22 40 12 55 17c3 17-3 29-22 28Z"
              fill="#4ba244"
            />
            <path
              d="M30 56 20 23M30 56l14-29"
              stroke="#237b3e"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path d="M30 46c-18 4-21-3-24-10 14-9 24-4 24 10Z" fill="#5da837" />
          </>
        )}
      </svg>
    </span>
  );
}
