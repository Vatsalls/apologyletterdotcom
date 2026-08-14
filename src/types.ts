export interface PhotoItem {
  id: string;
  url: string;
  caption: string;
  date?: string;
  frameStyle: 'polaroid' | 'sunflower' | 'scribble' | 'notebook' | 'tape';
  sticker?: string;
  likes?: number;
}

export interface MessageItem {
  id: string;
  senderName: string;
  message: string;
  mood?: string;
  timestamp: string;
  read?: boolean;
}

export interface AdminData {
  visitorCount: number;
  lastVisit: string | null;
  visitors: { time: string; userAgent: string }[];
  messages: MessageItem[];
  customLetter: string;
}
