import React from 'react';
import { Formik, Field } from 'formik';
import gql from 'graphql-tag';
import * as Yup from 'yup';
import { Mutation } from 'react-apollo';
import { Form, Message } from 'semantic-ui-react';
import RadioInput from 'components/RadioInput';
import TextArea from '../TextArea';
import TextInput from '../TextInput';
import AsyncButton from '../AsyncButton';
import { CenterWrapper } from '../../styles/App';
import { DAILY_REPORTS_QUERY } from '../../containers/DailyReportPage/DailyReportContainer';
import RadioButton from '../RadioButton';

const CREATE_DAILY_REPORT_MUTATION = gql`

  mutation CREATE_DAILY_REPORT_MUTATION (
    $title: String!
    $emotion: String!
    $achievement: String!
    $plan: String!
    $comment: String
  ) {
    createDailyReport(
      title: $title
      emotion: $emotion
      achievement: $achievement
      plan: $plan
      comment: $comment
    ) {
      id
      title
      emotion
      achievement
      plan
      comment
    }
  }
`;

const DailyReportSchema = Yup.object().shape({
  title: Yup.string()
    .required('Title is required'),
  emotion: Yup.string()
    .required('Emotion option is required'),
  achievement: Yup.string()
    .required('Achievement is required'),
  plan: Yup.string()
    .required('Plan is required')
});


const DailyReportForm = () => (
  <Mutation
    mutation={CREATE_DAILY_REPORT_MUTATION}
    update={(store, { data: { createDailyReport } }) => {
      if(store.data.data.ROOT_QUERY.userReports){
        const data = store.readQuery({ query: DAILY_REPORTS_QUERY });
        data.userReports.push(createDailyReport);
        store.writeQuery({ query: DAILY_REPORTS_QUERY, data });
      }
    }}
  >
    {(createDailyReport, { loading, error }) => (
      <CenterWrapper>
        {error && <div>error</div>}
        <Formik
          initialValues={{
            title: '',
            emotion: '',
            achievement: '',
            plan: '',
            comment: ''
          }}
          enableReinitialize
          validationSchema={DailyReportSchema}
          onSubmit={async (values, { setSubmitting, setStatus, setErrors, resetForm }) => {
            const { title, emotion, achievement, plan, comment } = values;

            try {
              await createDailyReport({
                variables: {
                  title,
                  emotion,
                  achievement,
                  plan,
                  comment
                }
              });
              resetForm({});
              setStatus({success: true});
            } catch (error) {
              setStatus({success: false});
              setSubmitting(false);
              setErrors({submit: error.message})
            }
          }}

          render={({ values, handleSubmit, handleChange, touched, errors, status }) => (
            <Form
              onSubmit={handleSubmit}
              loading={loading}
              success={status ? status.success : false}
            >
              <TextInput
                type="text"
                label="Title"
                name="title"
                value={values.title || ''}
                error={touched.title && errors.title}
                onChange={handleChange}
              />

              <RadioInput
                id="emotion"
                label="Emotion"
                name="emotion"
                values={values.emotion}
                error={errors.emotion}
                touched={touched.emotion}
              >
                <Field
                  defaultChecked
                  id=":grinning:"
                  name="emotion"
                  component={RadioButton}
                  label=":grinning:"
                />

                <Field
                  id=":neutral_face:"
                  name="emotion"
                  component={RadioButton}
                  label=":neutral_face:"
                />

                <Field
                  id=":disappointed_relieved:"
                  name="emotion"
                  component={RadioButton}
                  label=":disappointed_relieved:"
                />
              </RadioInput>

              <TextArea
                type="textarea"
                label="Today Achievement"
                name="achievement"
                value={values.achievement || ''}
                error={touched.achievement && errors.achievement}
                onChange={handleChange}
              />

              <TextArea
                type="textarea"
                label="Plan for next day"
                name="plan"
                value={values.plan || ''}
                error={touched.plan && errors.plan}
                onChange={handleChange}
              />

              <TextArea
                type="textarea"
                label="Comment"
                name="comment"
                value={values.comment || ''}
                error={touched.comment && errors.comment}
                onChange={handleChange}
              />

              <Message success header='Create Successfully!' content="Your report has been created." />

              <AsyncButton
                buttonName="Create"
                type="submit"
                loading={loading}
              />
            </Form>
          )}
        />
      </CenterWrapper>
    )}
  </Mutation>
);

export default DailyReportForm;