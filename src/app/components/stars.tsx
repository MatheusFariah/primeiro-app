import { Rating } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";

export function Stars({ rating }: { rating: number }) {
  return (
    <Rating
      name="rating"
      value={rating}
      precision={0.5}
      readOnly
      icon={
        <StarIcon
          fontSize="inherit"
          sx={{
            color: "#04b44d",
            textShadow: "0 0 8px rgba(4,180,77,0.7)",
          }}
        />
      }
      emptyIcon={
        <StarOutlineIcon
          fontSize="inherit"
          sx={{
            color: "#444",
            textShadow: "0 0 4px rgba(0,0,0,0.8)",
          }}
        />
      }
    />
  );
}
