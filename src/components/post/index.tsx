import React,{ forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import { ResizeMode, Video } from "expo-av";
import styles from "./styles";
import { VideoDTO } from "../../../types";
import PostLayout from "./layout";
import { throttle } from "throttle-debounce";

export interface PostSingleHandles {
  play: () => Promise<void>;
  stop: () => Promise<void>;
  handleUpdateLike: () => void;
  unload: () => Promise<void>;
  togglePlay: () => Promise<void>;
  pause: () => Promise<void>;
}


export const PostSingle = forwardRef<
  PostSingleHandles,
  { item: VideoDTO; }
>(({ item }, parentRef) => {
  const ref = useRef<Video>(null);

  useImperativeHandle(parentRef, () => ({
    play,
    pause,
    stop,
    handleUpdateLike,
    togglePlay,
    unload,
  }));

  const [currentLikeState, setCurrentLikeState] = useState({
    state: false,
    counter: item.likes_count,
  });

  useEffect(() => {
    return () => {
      unload()
        .then(() => {})
        .catch((e) => {
          console.log("Failed to unload:", e);
        });
    };
  }, []);

  const play = async () => {
    if (ref.current == null) {
      return;
    }
    try {
      const status = await ref.current.getStatusAsync();
      if (status && "isPlaying" in status && status.isPlaying) {
        return;
      }
      await ref.current.playAsync();
    } catch (e) {
      console.log("An error occurred:", e);
    }
  };

  const stop = async () => {
    if (ref.current == null) {
      return;
    }
    try {
      const status = await ref.current.getStatusAsync();
      if (status && "isPlaying" in status && !status.isPlaying) {
        return;
      }
      await ref.current.stopAsync();
    } catch (e) {
      console.log("An error occurred:", e);
    }
  };

  const pause = async () => {
    if (ref.current == null) {
      return;
    }
    try {
      const status = await ref.current.getStatusAsync();
      if (status && "isPlaying" in status && !status.isPlaying) {
        return;
      }
      await ref.current.pauseAsync();
    } catch (e) {
      console.log("An error occurred:", e);
    }
  };

  const unload = async () => {
    if (ref.current == null) {
      return;
    }
    try {
      await ref.current.unloadAsync();
    } catch (e) {
      console.log(e);
    }
  };

  const togglePlay = async () => {
    if (ref.current == null) {
      return;
    }
    try {
      const status = await ref.current.getStatusAsync();
      if (status && "isPlaying" in status && status.isPlaying) {
        await ref.current.pauseAsync();
      } else {
        await ref.current.playAsync();
      }
    } catch (e) {
      console.log("An error occurred:", e);
    }
  };

  const handleUpdateLike = useMemo(
    () =>
      throttle(300, () => {
        setCurrentLikeState({
          state: !currentLikeState.state,
          counter:
            currentLikeState.counter +
            (currentLikeState.state ? -1 : 1),
        });
      }),
    []
  );

  return (
    <>
      <PostLayout post={item} setCurrentLikeState={setCurrentLikeState} currentLikeState={currentLikeState} />
      <Video
        ref={ref}
        style={styles.container}
        resizeMode={ResizeMode.COVER}
        shouldPlay={false}
        isLooping
        usePoster
        posterStyle={{ resizeMode: "cover", height: "100%" }}
        source={{
          uri: item.clip_url,
        }}
      />
    </>
  );
});

export default PostSingle;
