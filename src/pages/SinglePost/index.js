import React, { useContext, useState, useRef } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Card, Grid, Image, Button, Icon, Label, Transition, Form, Popup } from 'semantic-ui-react';
import moment from 'moment';
import { FETCH_POST_QUERY, CREATE_COMMENT_MUTATION } from '../../utils/graphql';
import { AuthContext } from '../../context/auth';
import { LikeButton, DeleteButton } from '../../components';

function SinglePost({
  match: {
    params: { postId },
  },
  history: { push },
}) {
  const { data: { getPost: post } = {} } = useQuery(FETCH_POST_QUERY, {
    variables: { postId },
  });

  const [response, setResponse] = useState('');

  const [submitComment] = useMutation(CREATE_COMMENT_MUTATION, {
    update() {
      setResponse('');
      commentInputRef.current.blur();
    },
    variables: {
      postId,
      body: response,
    },
  });

  const { user } = useContext(AuthContext);

  const commentInputRef = useRef(null);

  if (!post) return <p>Loading post...</p>;

  const {
    username,
    createdAt,
    body,
    id,
    likes,
    likeCount,
    commentCount,
    comments,
    profileImage,
  } = post;

  const deletePostCallback = () => push('/');

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width={2}>
          <Image floated="right" size="small" src={profileImage} circular />
        </Grid.Column>
        <Grid.Column width={10}>
          <Card fluid>
            <Card.Content>
              <Card.Header>{username}</Card.Header>
              <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
              <Card.Description>{body}</Card.Description>
            </Card.Content>
            <hr />
            <Card.Content extra>
              <LikeButton user={user} post={{ id, likes, likeCount }} />
              <Button as="div" labelPosition="right" onClick={() => {}}>
                <Button basic color="blue">
                  <Icon name="comments" />
                </Button>
                <Label basic color="blue" pointing="left">
                  {commentCount}
                </Label>
              </Button>
              {user && user.username === username && (
                <DeleteButton postId={id} callback={deletePostCallback} />
              )}
            </Card.Content>
          </Card>
          <Transition.Group>
            {user && (
              <Card fluid>
                <Card.Content>
                  <p>Post a comment</p>
                  <Form onSubmit={submitComment}>
                    <div className="ui action input fluid">
                      <input
                        type="text"
                        placeholder="Comment..."
                        name="comment"
                        value={response}
                        onChange={(event) => setResponse(event.target.value)}
                        ref={commentInputRef}
                      />
                      <Popup
                        content="Submit a message"
                        inverted
                        trigger={
                          <button
                            type="submit"
                            className="ui button teal"
                            disabled={response.trim() === ''}
                          >
                            Submit
                          </button>
                        }
                      />
                    </div>
                  </Form>
                </Card.Content>
              </Card>
            )}
            {comments.map((comment) => (
              <Card fluid key={comment.id}>
                <Card.Content>
                  {user && user.username === comment.username && (
                    <DeleteButton postId={id} commentId={comment.id} />
                  )}
                  <Card.Header>{comment.username}</Card.Header>
                  <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                  <Card.Description>{comment.body}</Card.Description>
                </Card.Content>
              </Card>
            ))}
          </Transition.Group>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}

export default SinglePost;
