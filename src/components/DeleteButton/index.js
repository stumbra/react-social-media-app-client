import React, { useState } from 'react';
import { Button, Icon, Confirm, Popup } from 'semantic-ui-react';
import { useMutation } from '@apollo/client';
import {
  DELETE_POST_MUTATION,
  FETCH_POSTS_QUERY,
  DELETE_COMMENT_MUTATION,
} from '../../utils/graphql';

function DeleteButton({ postId, callback, commentId }) {
  const [isVisible, setVisibility] = useState(false);

  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION;

  const [deletePostOrMutation] = useMutation(mutation, {
    update(proxy) {
      setVisibility(false);
      if (!commentId) {
        const data = proxy.readQuery({ query: FETCH_POSTS_QUERY });
        proxy.writeQuery({
          query: FETCH_POSTS_QUERY,
          data: { getPosts: data.getPosts.filter((p) => p.id !== postId) },
        });
      }
      if (callback) callback();
    },
    variables: {
      postId,
      commentId,
    },
    onError(err) {
      console.error(err);
    },
  });

  return (
    <>
      <Popup
        content={`Delete ${commentId ? 'comment' : 'post'}`}
        inverted
        trigger={
          <Button
            as="div"
            color="red"
            onClick={() => {
              setVisibility(true);
            }}
            floated="right"
          >
            <Icon name="trash" style={{ margin: 0 }} />
          </Button>
        }
      />
      <Confirm
        open={isVisible}
        onCancel={() => setVisibility(false)}
        onConfirm={deletePostOrMutation}
      />
    </>
  );
}

export default DeleteButton;
