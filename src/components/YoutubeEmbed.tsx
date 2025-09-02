import React from "react";

interface YouTubeEmbedProps {
  videoId: string;
}

const YouTubeEmbed: React.FC<YouTubeEmbedProps> = ({ videoId }) => {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        paddingBottom: "56.25%", // 16:9 aspect ratio
        height: 0,
      }}
    >
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          borderRadius: "12px",
          border: "none",
        }}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
};

export default YouTubeEmbed;
