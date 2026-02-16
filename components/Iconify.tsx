"use client";
import { Icon } from "@iconify/react";

interface Props {
  icon: string;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

export default function Iconify({
  icon,
  width = 24,
  height = 24,
  className = "",
  style,
}: Props) {
  return (
    <Icon
      icon={icon}
      width={width}
      height={height}
      className={className}
      style={style}
    />
  );
}
