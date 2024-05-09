import React, {useMemo} from 'react';
import {View, Text, TouchableOpacity, Share} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './styles';
import {VideoDTO} from '../../../../types';
import {throttle} from 'throttle-debounce';
import Entypo from 'react-native-vector-icons/Entypo';
import Fontisto from 'react-native-vector-icons/Fontisto';

export default function PostLayout({
  post,
  currentLikeState,
  setCurrentLikeState,
}: {
  post: VideoDTO;
  currentLikeState: {state: boolean; counter: number};
  setCurrentLikeState: React.Dispatch<
    React.SetStateAction<{state: boolean; counter: number}>
  >;
}) {
  const currentViewsCount = post.views_count;
  
  const handleSharePost = () => {
    Share.share({
      url: post.clip_url,
      message: post.clip_url,
      title: 'Check out this post',
    });
  }

  const handleUpdateLike = useMemo(
    () =>
      throttle(500, (currentLikeStateInst: typeof currentLikeState) => {
        setCurrentLikeState({
          state: !currentLikeStateInst.state,
          counter:
            currentLikeStateInst.counter +
            (currentLikeStateInst.state ? -1 : 1),
        });
      }),
    [],
  );

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.displayName}>{post.publishing_user}</Text>
        <Text style={styles.description}>{post.description}</Text>
      </View>
      <View style={styles.leftContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleUpdateLike(currentLikeState)}>
          <Ionicons
            color={currentLikeState.state ? 'red' : 'white'}
            size={40}
            name={currentLikeState.state ? 'heart' : 'heart-outline'}
          />
          <Text style={styles.actionButtonText}>
            {currentLikeState.counter}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Entypo name={'eye'} size={35} color="white" />
          <Text style={styles.actionButtonText}>{currentViewsCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSharePost} style={styles.actionButton}>
          <Fontisto name={'share-a'} size={25} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
