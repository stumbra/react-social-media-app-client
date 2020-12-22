import React from 'react';
import { useMutation } from '@apollo/client';
import { Button, Form, Popup } from 'semantic-ui-react';
import { FETCH_POSTS_QUERY, CREATE_POST_MUTATION } from '../../utils/graphql';
import { useForm } from '../../utils/hooks';

function PostForm() {
  const { onChange, onSubmit, values } = useForm(createPostCallback, {
    body: '',
  });

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({ query: FETCH_POSTS_QUERY });
      proxy.writeQuery({
        query: FETCH_POSTS_QUERY,
        data: { getPosts: [result.data.createPost, ...data.getPosts] },
      });
      values.body = '';
    },
    onError(err) {
      console.error(err);
    },
  });

  function createPostCallback() {
    createPost();
  }

  return (
    <>
      <Form onSubmit={onSubmit}>
        <h2>Create a post:</h2>
        <Form.Field>
          <Form.Input
            placeholder="Hi World!"
            name="body"
            onChange={onChange}
            value={values.body}
            error={!!error}
          />
          <Popup
            content="Submit a post"
            inverted
            trigger={
              <Button type="submit" color="teal">
                Submit
              </Button>
            }
          />
        </Form.Field>
      </Form>
      {error && (
        <div className="ui error message" style={{ marginBottom: 20 }}>
          <ul className="list">
            <li>{error.graphQLErrors[0].message}</li>
          </ul>
        </div>
      )}
    </>
  );
}

export default PostForm;
