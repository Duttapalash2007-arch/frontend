import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import diseaseService from '../../services/diseaseService'
import userService from '../../services/userService'
import { useAuth } from '../../hooks/useAuth'
import { GENERAL_ANALYSIS_DISEASE } from '../../utils/constants'
import { validatePhoneNumber } from '../../utils/validators'

const fallbackQuestions = {
  Cancer: ['Do you have unexplained weight loss?', 'Have symptoms lasted for several weeks?'],
  Allergy: ['Are symptoms triggered by dust, food, or weather?', 'Do you have itching or rash?'],
  Malaria: ['Do you have repeated fever or chills?', 'Have you recently travelled to a mosquito-prone area?'],
  Diabetes: ['Do you feel very thirsty often?', 'Do you urinate frequently?'],
  HIV: ['Have you had persistent fever or fatigue?', 'Have you noticed unexplained weight loss?'],
  AIDS: ['Do you experience recurring infections?', 'Have symptoms worsened over time?']
}

const splitFullName = (value, currentUser) => {
  const trimmedValue = value.trim()
  if (!trimmedValue) {
    return {
      firstName: currentUser?.firstName,
      lastName: currentUser?.lastName
    }
  }

  const [firstName, ...rest] = trimmedValue.split(/\s+/)
  return {
    firstName,
    lastName: rest.join(' ') || firstName
  }
}

export default function DiseaseForm() {
  const { disease } = useParams()
  const navigate = useNavigate()
  const { user, updateUser } = useAuth()
  const isGeneralAnalysis = disease === GENERAL_ANALYSIS_DISEASE
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [file, setFile] = useState(null)
  const [formState, setFormState] = useState({
    fullName: [user?.firstName, user?.lastName].filter(Boolean).join(' '),
    phoneNumber: user?.phoneNumber || '',
    address: user?.address?.street || '',
    age: user?.age || '',
    gender: user?.gender || '',
    weight: '',
    height: '',
    bloodType: '',
    medicalHistory: '',
    symptoms: ''
  })
  const [answers, setAnswers] = useState({})

  useEffect(() => {
    let ignore = false
    setLoading(true)

    if (isGeneralAnalysis) {
      setQuestions([])
      setLoading(false)
      return () => {
        ignore = true
      }
    }

    diseaseService
      .getQuestions(disease)
      .then((response) => {
        if (!ignore) {
          setQuestions(response.data.questions || [])
        }
      })
      .catch(() => {
        if (!ignore) {
          setQuestions([])
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false)
        }
      })

    return () => {
      ignore = true
    }
  }, [disease, isGeneralAnalysis])

  const renderedQuestions = useMemo(() => {
    if (questions.length) {
      return questions
    }

    return (fallbackQuestions[disease] || []).map((question, index) => ({
      _id: `fallback-${index + 1}`,
      questionNumber: index + 1,
      question,
      options: [
        { text: 'Yes' },
        { text: 'No' }
      ]
    }))
  }, [disease, questions])

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormState((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async () => {
    setError('')

    if (!formState.symptoms.trim()) {
      setError('Please describe the symptoms before generating the report.')
      return
    }

    if (!formState.fullName.trim()) {
      setError('Please provide the patient name.')
      return
    }

    if (!validatePhoneNumber(formState.phoneNumber)) {
      setError('Please enter a valid phone number.')
      return
    }

    if (!formState.address.trim()) {
      setError('Please enter the patient address.')
      return
    }

    if (isGeneralAnalysis && !file) {
      setError('Please upload a photo or report for the general condition analysis.')
      return
    }

    setSubmitting(true)

    try {
      const profileNames = splitFullName(formState.fullName, user)
      const profileResponse = await userService.updateProfile({
        firstName: profileNames.firstName,
        lastName: profileNames.lastName,
        age: formState.age ? Number(formState.age) : undefined,
        gender: formState.gender || undefined,
        phoneNumber: formState.phoneNumber,
        address: {
          street: formState.address
        }
      })

      updateUser(profileResponse.data.user)

      navigate('/processing', {
        state: {
          submission: {
            disease,
            symptoms: formState.symptoms,
            mcqAnswers: answers,
            analysisMode: isGeneralAnalysis ? 'general-condition' : 'disease-specific',
            personalDetails: {
              address: formState.address,
              age: formState.age ? Number(formState.age) : undefined,
              gender: formState.gender || undefined,
              weight: formState.weight ? Number(formState.weight) : undefined,
              height: formState.height ? Number(formState.height) : undefined,
              bloodType: formState.bloodType || undefined,
              medicalHistory: formState.medicalHistory || undefined
            },
            document: file
          }
        }
      })
    } catch (submitError) {
      setError(submitError.response?.data?.message || 'Unable to continue to report generation.')
      setSubmitting(false)
    }
  }

  return (
    <Layout>
      <div className="container form-page">
        <section className="surface-card">
          <h1>{isGeneralAnalysis ? 'Analyze any disease and my condition' : `${disease} assessment`}</h1>
          <p>
            {isGeneralAnalysis
              ? 'Upload a photo or report, describe the symptoms clearly, and let the AI estimate likely condition areas and the next steps you should consider.'
              : 'Answer the questions, describe the symptoms, and upload any supporting file.'}
          </p>
        </section>

        <section className="form-layout">
          <div className="surface-card">
            <div className="section-header">
              <div>
                <h2>{isGeneralAnalysis ? 'Symptom Review' : 'Questions'}</h2>
                <p>
                  {isGeneralAnalysis
                    ? 'Describe symptoms in detail so the AI can compare them with the uploaded photo or report.'
                    : loading
                      ? 'Loading disease questions...'
                      : 'MCQ questions for the selected disease.'}
                </p>
              </div>
            </div>

            <div className="question-stack">
              {isGeneralAnalysis ? (
                <article className="question-card">
                  <strong>AI upload-assisted condition analysis</strong>
                  <p>
                    The uploaded photo or report will be reviewed together with the symptom
                    description to estimate likely health-condition areas, possible disease names,
                    supporting observations, and suggested next steps.
                  </p>
                </article>
              ) : (
                renderedQuestions.map((question, index) => (
                  <article key={question._id || index} className="question-card">
                    <strong>
                      Q{question.questionNumber || index + 1}. {question.question}
                    </strong>
                    <div className="question-options">
                      {(question.options || []).map((option) => (
                        <label key={option.text}>
                          <input
                            type="radio"
                            name={question._id}
                            value={option.text}
                            checked={answers[question._id] === option.text}
                            onChange={(event) => setAnswers((current) => ({ ...current, [question._id]: event.target.value }))}
                          />
                          <span>{option.text}</span>
                        </label>
                      ))}
                    </div>
                  </article>
                ))
              )}

              <label className="field-block">
                Symptom Description
                <textarea
                  name="symptoms"
                  value={formState.symptoms}
                  onChange={handleInputChange}
                  rows="6"
                  placeholder="Describe symptoms, timing, pain, triggers, duration, and anything important the AI should consider."
                />
              </label>
            </div>
          </div>

          <div className="surface-card">
            <div className="section-header">
              <div>
                <h2>Patient Details</h2>
                <p>
                  {isGeneralAnalysis
                    ? 'Upload is mandatory here. Add a photo or report and include personal details for better analysis.'
                    : 'Upload a document and add personal details for the report.'}
                </p>
              </div>
            </div>

            <div className="detail-grid">
              <label className="upload-dropzone">
                <input type="file" hidden onChange={(event) => setFile(event.target.files?.[0] || null)} />
                <strong>{isGeneralAnalysis ? 'Upload photo or report' : 'Upload file'}</strong>
                <span>
                  {file
                    ? file.name
                    : isGeneralAnalysis
                      ? 'Required: click to attach a photo, PDF, or medical report for AI review.'
                      : 'Drag and drop or click to attach a PDF, image, or document.'}
                </span>
              </label>

              <label className="field-block">
                Name
                <input name="fullName" value={formState.fullName} onChange={handleInputChange} />
              </label>

              <label className="field-block">
                Phone
                <input name="phoneNumber" value={formState.phoneNumber} onChange={handleInputChange} />
              </label>

              <label className="field-block field-block--full">
                Address
                <textarea name="address" value={formState.address} onChange={handleInputChange} rows="3" />
              </label>

              <label className="field-block">
                Age
                <input name="age" type="number" value={formState.age} onChange={handleInputChange} />
              </label>

              <label className="field-block">
                Gender
                <select name="gender" value={formState.gender} onChange={handleInputChange}>
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </label>

              <label className="field-block">
                Weight (kg)
                <input name="weight" type="number" value={formState.weight} onChange={handleInputChange} />
              </label>

              <label className="field-block">
                Height (cm)
                <input name="height" type="number" value={formState.height} onChange={handleInputChange} />
              </label>

              <label className="field-block">
                Blood Type
                <input name="bloodType" value={formState.bloodType} onChange={handleInputChange} placeholder="A+, O-, etc." />
              </label>

              <label className="field-block field-block--full">
                Medical History
                <textarea
                  name="medicalHistory"
                  value={formState.medicalHistory}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Previous conditions, allergies, or ongoing medication."
                />
              </label>
            </div>

            {error ? <div className="form-alert">{error}</div> : null}

            <button type="button" className="primary-button form-submit" onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Preparing analysis...' : 'Generate Report'}
            </button>
          </div>
        </section>
      </div>
    </Layout>
  )
}
