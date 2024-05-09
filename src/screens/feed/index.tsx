import {
  FlatList,
  View,
  Dimensions,
  ViewToken,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from 'react-native';
import styles from './styles';
import PostSingle, {PostSingleHandles} from '../../components/post';
import { useContext, useEffect, useRef, useState} from 'react';
import {PostDTO, VideoDTO} from '../../../types';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CurrentUserProfileItemInViewContext} from '../../navigation/feed';
import useMaterialBarHeight from '../../hooks/useMaterialNavBarHeight';
import React from 'react';
import { ApiUrl } from '../../utils/ApiUrl';

interface PostViewToken extends ViewToken {
  item: VideoDTO;
}

export default function FeedScreen() {
  const {currentUserProfileItemInView,
    setCurrentUserProfileItemInView} = useContext(
    CurrentUserProfileItemInViewContext,
  );

  const [posts, setPosts] = useState<PostDTO>();
  const mediaRefs = useRef<Record<string, PostSingleHandles | null>>({});
  const [loading, setLoading] = useState<Boolean>(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const doubleTapRef = useRef<NodeJS.Timeout | null>(null);
  const activeCell = useRef<PostSingleHandles | null>(mediaRefs.current[0]);
  const focusedPost = useRef<VideoDTO | null>(null);
  const viewConfigRef = useRef({viewAreaCoveragePercentThreshold: 50});

  const fetchPosts = async (url: string, loadingMorePosts: boolean = false) => {
    setLoading(true);
    if (loadingMore) return; // Prevent multiple calls
    try {
      if (loadingMorePosts) {
        const response = await axios.get(url);
        focusedPost.current = response.data.videos[0];
        setPosts(oldPosts => ({
          videos: [...oldPosts.videos, ...response.data.videos],
          next_page: response?.data?.next_page,
        }));
      } else {
        const response = await axios.get(url);

        focusedPost.current = response.data.videos[0];
        setPosts(response.data as PostDTO);
        // And cache the data
        await AsyncStorage.setItem(
          'cachedPosts',
          JSON.stringify(response.data),
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initFetch = async () => {
      setLoading(true);
      const cachedPosts = await AsyncStorage.getItem('cachedPosts');
      if (cachedPosts) {
        setPosts(JSON.parse(cachedPosts));
      } else {
        await fetchPosts(
         ApiUrl
        );
      }
      setLoading(false);
    };
    initFetch();
  }, []);

  const renderFooter = () => {
    if (loading) {
      return <ActivityIndicator style={{marginVertical: 20}} size="large" />;
    }
    return null;
  };

  const handleLoadMore = () => {
    if (!loading && !loadingMore) {
      if (posts?.next_page && posts?.next_page !== '') {
        setLoadingMore(true);
        fetchPosts(posts?.next_page, true).finally(() => {
          setLoadingMore(false);
        });
      }
    }
  };

  const onViewableItemsChanged = useRef(
    ({changed}: {changed: PostViewToken[]}) => {
      changed.forEach(element => {
        const cell = mediaRefs.current[element.key];
        if (cell) {
          if (element.isViewable) {
            activeCell.current = cell;
            if (setCurrentUserProfileItemInView) {
              cell.play();
            }
          } else {
            cell.stop();
          }
        }
      });
    },
  );

  const handleTap = () => {
    if (doubleTapRef.current) {
      clearTimeout(doubleTapRef.current);
      doubleTapRef.current = null;
      activeCell.current?.handleUpdateLike();
    } else {
      doubleTapRef.current = setTimeout(() => {
        activeCell.current?.togglePlay();
        doubleTapRef.current = null;
      }, 300);
    }
  };

  const feedItemHeight =
    Dimensions.get('window').height - useMaterialBarHeight(false);

  const renderItem = ({item, index}: {item: VideoDTO; index: number}) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => handleTap()}
        style={{
          height: feedItemHeight,
        }}>
        <View
          style={{
            height: feedItemHeight,
            backgroundColor: 'black',
          }}>
          <PostSingle
            item={item}
            ref={PostSingeRef => (mediaRefs.current[item.id] = PostSingeRef)}
          />
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={posts?.videos}
        windowSize={4}
        initialNumToRender={2}
        maxToRenderPerBatch={2}
        removeClippedSubviews
        viewabilityConfig={viewConfigRef.current}
        renderItem={renderItem}
        pagingEnabled
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        keyExtractor={item => item.id}
        decelerationRate={'fast'}
        onViewableItemsChanged={onViewableItemsChanged.current}
      />
    </View>
  );
}
