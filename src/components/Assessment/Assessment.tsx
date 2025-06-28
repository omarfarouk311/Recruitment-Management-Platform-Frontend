import { AlertCircleIcon, CheckIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useState, useEffect } from "react";
import Button from "../common/Button";
import UserNav from "../Header/UserNav";
import { DeleteDialog } from "./DeleteDialog";
import { InstructionsDialog } from "./InstructionsDialog";
import useStore from "../../stores/globalStore";
import { Timer } from "./Timer";
import SkeletonLoader from "../common/SkeletonLoader";
import { UserRole } from "../../stores/User Slices/userSlice";
import { useParams } from "react-router-dom";

export const Assessment = () => {
  const [activeQuestion, setActiveQuestion] = useState(-1);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const userRole = useStore.useUserRole();
  const [timeIsUp, setTimeIsUp] = useState(false);
  const assessmentData = useStore.useAssessmentData();
  const modifyQuestions = useStore.useAssessmentModifyQuestions();
  const submitAnswers = useStore.useAssessmentSubmitAnswers();
  const isLoading = useStore.useAssessmentIsLoading();
  const submitionIsLoading = useStore.useAssessmentSubmitionIsLoading();
  const fetchAssessmentData = useStore.useFetchAssessmentData();
  const { assessmentId, jobId } = useParams();
  const reset = useStore.useClearAssessmentData();

  // Textarea auto-resize effect
  useEffect(() => {
    const resizeTextareas = () => {
      document.querySelectorAll("textarea").forEach((textarea) => {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      });
    };
    resizeTextareas();
    window.addEventListener("resize", resizeTextareas);
    return () => window.removeEventListener("resize", resizeTextareas);
  }, [assessmentData, activeQuestion]);

  // Effect to open instructions modal when assessment data is loaded for seeker
  useEffect(() => {
    if (isLoading == false && assessmentData?.questions.length && userRole !== UserRole.COMPANY)
      setShowInstructionsModal(true);
    if(!isLoading && assessmentData?.questions.length)
      setActiveQuestion(0);
  }, [assessmentData?.id]);

  // Effect to submit answers when time is up
  useEffect(() => {
    if (timeIsUp) {
      submitAnswers();
    }
  }, [timeIsUp]);

  // Fetch assessment data on component mount
  useEffect(() => {
    if(userRole === UserRole.SEEKER)
      fetchAssessmentData(parseInt(assessmentId!), parseInt(jobId!));
    else if (userRole === UserRole.COMPANY && assessmentId)
      fetchAssessmentData(parseInt(assessmentId));

    return reset;
  }, []);


  const handleAddAnswer = (questionId: number) => {
    modifyQuestions((questions) => {
      return (questions || []).map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: [...q.answers, ""],
            }
          : q
      );
    });
  };


  const handleAddQuestion = () => {
    modifyQuestions((questions) => {
      setActiveQuestion(questions.length);
      return [
        ...(questions || []),
        {
          id: questions.length + 1,
          questionNum: questions.length + 1,
          question: "",
          answers: [""],
          correctAnswers: [],
        },
      ];
    });
  };


  const handleAnswerToggle = (questionId: number, answerIndex: number) => {
    modifyQuestions((questions) =>
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              correctAnswers: q.correctAnswers.includes(answerIndex)
                ? q.correctAnswers.filter((a) => a !== answerIndex)
                : [...q.correctAnswers, answerIndex],
            }
          : q
      )
    );
  };


  const handleDeleteQuestion = () => {
    modifyQuestions((questions) => {
      const newQuestions = questions
        .filter((_, i) => i !== activeQuestion)
        .map((q, i) =>
          activeQuestion + 1 < q.questionNum
            ? {
                ...q,
                questionNum: q.questionNum - 1,
              }
            : q
        );
      const newActiveQuestion = Math.min(
        activeQuestion - 1,
        newQuestions.length - 1
      );
      setActiveQuestion(newActiveQuestion < 0 ? 0 : newActiveQuestion);
      setShowDeleteModal(false);
      console.log(newQuestions);
      return newQuestions;
    });
  };


  const handleDeleteAnswer = (questionId: number, answerIndex: number) => {
    modifyQuestions((questions) =>
      questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              answers: q.answers.filter((_, i) => i !== answerIndex),
              correctAnswers: q.correctAnswers.filter((a) => a !== answerIndex),
            }
          : q
      )
    );
  };


  return (
    <>
      {userRole === UserRole.COMPANY && (
        <div className="fixed top-0 w-full z-10">
          <UserNav />
        </div>
      )}

      <div
        className={`bg-[#fafbff] flex flex-row justify-center w-full min-h-screen ${
          userRole === UserRole.COMPANY ? "pt-20" : ""
        }`}
      >
        <DeleteDialog
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteQuestion}
          title="Delete Question"
          description="Are you sure you want to delete this question?"
        />

        <InstructionsDialog
          isOpen={showInstructionsModal}
          onClose={() => setShowInstructionsModal(false)}
          userRole={userRole}
        />

        <div className="bg-[#fafbff] w-full max-w-[1704px] relative">
          <div className="flex">
            {/* Narrower Sidebar Navigation */}
            <nav className="w-[100px] bg-[#ececec] left-0 fixed shadow-[0px_4px_4px_#00000040] h-screen overflow-y-auto z-10">
              <div className="flex justify-center pt-4 pb-2">
                <AlertCircleIcon
                  className="w-8 h-8 cursor-pointer transition-colors duration-150 hover:text-gray-500"
                  onClick={(e) => {
                  e.stopPropagation();
                  setShowInstructionsModal(true);
                  }}
                />
              </div>
              {assessmentData?.questions.map((question, index) => (
                <div
                  key={question.questionNum}
                  className="relative cursor-pointer"
                  onClick={() => setActiveQuestion(index)}
                >

                  <div
                    className={`h-16 flex items-center justify-center ${
                      activeQuestion === index ? "bg-black" : "bg-transparent"
                    }`}
                  >
                    <span
                      className={`font-semibold text-2xl ${
                        activeQuestion === index ? "text-white" : "text-black"
                      }`}
                    >
                      {question.questionNum}
                    </span>
                  </div>
                  <div className="w-full h-px bg-gray-300" />
                </div>
              ))}

              {userRole === UserRole.COMPANY && (
                <div
                  className="flex justify-center items-center h-16 cursor-pointer hover:bg-gray-200"
                  onClick={handleAddQuestion}
                >
                  <PlusIcon className="w-8 h-8" />
                </div>
              )}
            </nav>

            {/* Main Content */}
            {isLoading ? (
              <div
                className={`pl-44 pr-20 z-20${
                  userRole === UserRole.COMPANY ? "pt-8" : "pt-6"
                } w-full max-w-screen relative`}
              >
                <SkeletonLoader />
              </div>
            ) : (
              <div className="flex-1 pl-44 pr-20 py-8 relative">
                {userRole === UserRole.SEEKER && (
                  <Timer
                    className="mr-16"
                    initialSeconds={assessmentData?.time || 0}
                    timeIsUp={timeIsUp}
                    setTimeIsUp={setTimeIsUp}
                  />
                )}
                {/* Question Header */}
                { activeQuestion === -1 ? (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-2xl text-gray-400">Please select a question to display.</p>
                  </div>
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-semibold text-gray-500 text-3xl">
                        Question {activeQuestion + 1}
                      </h3>
                      {userRole === UserRole.COMPANY && (
                        <div className="relative group">
                          <button
                            className="text-red-500 hover:text-red-600 flex items-center relative disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => setShowDeleteModal(true)}
                            disabled={assessmentData?.questions.length === 1}
                          >
                            <TrashIcon className="w-5 h-5 mr-2" />
                            <span>Delete Question</span>
                          </button>
                          {assessmentData?.questions.length === 1 && (
                            <div className="absolute bottom-full right-0 p-2 text-sm bg-gray-700 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                              You must have at least one question
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <textarea
                      value={assessmentData?.questions[activeQuestion]?.question || ""}
                      onChange={(e) =>
                        modifyQuestions((questions) =>
                          questions.map((q, i) =>
                            i === activeQuestion
                              ? {
                                  ...q,
                                  question: e.target.value,
                                }
                              : q
                          )
                        )
                      }
                      className="w-full p-4 rounded-2xl border border-gray-300 shadow-md resize-none overflow-hidden 
                            whitespace-pre-wrap break-words text-2xl min-h-[60px]"
                      placeholder="Enter your question here..."
                      disabled={userRole === UserRole.SEEKER}
                    />

                    {/* Answers Section */}
                    <section className="mt-8">
                      <h3 className="font-semibold text-gray-500 text-3xl mb-6">
                        Answers
                      </h3>

                      <div className="space-y-4">
                        {assessmentData?.questions[activeQuestion]?.answers.map(
                          (answer, i) => (
                            <div
                              key={`answer ${i}`}
                              className="w-1/2 min-h-[60px] bg-[#ececec] rounded-2xl p-3 cursor-pointer
                                  flex items-center border-2 border-transparent hover:border-gray-400
                                  justify-between group relative"
                              onClick={() =>
                                handleAnswerToggle(
                                  assessmentData.questions[activeQuestion].id,
                                  i
                                )
                              }
                            >
                              <div className="flex items-center flex-1">
                                <div className="w-6 h-6 bg-white rounded-md mr-4 flex items-center justify-center">
                                  {assessmentData.questions[
                                    activeQuestion
                                  ].correctAnswers?.includes(i) && (
                                    <CheckIcon className="w-5 h-5" />
                                  )}
                                </div>

                                {userRole === UserRole.COMPANY ? (
                                  <textarea
                                    value={answer}
                                    onChange={(e) =>
                                      modifyQuestions((questions) =>
                                        questions.map((q) =>
                                          q.id === questions[activeQuestion].id
                                            ? {
                                                ...q,
                                                answers: q.answers.map((a, j) =>
                                                  i === j ? e.target.value : a
                                                ),
                                              }
                                            : q
                                        )
                                      )
                                    }
                                    className="flex-1 bg-white rounded-2xl px-4 py-2 border border-gray-300 
                                        shadow-inner focus:outline-none break-words resize-none 
                                        overflow-hidden text-xl min-h-[40px]"
                                    onClick={(e) => e.stopPropagation()}
                                    placeholder="Enter answer option..."
                                  />
                                ) : (
                                  <div className="flex-1 break-words overflow-hidden text-ellipsis text-xl">
                                    {answer}
                                  </div>
                                )}
                              </div>

                              {userRole === UserRole.COMPANY && (
                                <button
                                  className="text-red-400 hover:text-red-500 ml-4"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteAnswer(
                                      assessmentData.questions[activeQuestion].id,
                                      i
                                    );
                                  }}
                                >
                                  <TrashIcon className="w-6 h-6" />
                                </button>
                              )}
                            </div>
                          )
                        )}
                      </div>
                      {/* Add Answer Button */}
                      <div className="flex !justify-end !right-4 mt-8 ">
                        {userRole === UserRole.COMPANY ? (
                          <Button
                            variant="primary"
                            className="!w-[30%]"
                            onClick={() =>
                              handleAddAnswer(
                                assessmentData!.questions[activeQuestion].id
                              )
                            }
                          >
                            Add Answer
                          </Button>
                        ) : (
                          <Button
                            variant="primary"
                            className="!w-[30%]"
                            onClick={async () => {
                              try {
                                if (
                                  assessmentData!.questions.length - 1 ===
                                  activeQuestion
                                ) {
                                  await submitAnswers();
                                } else {
                                  setActiveQuestion((prev) =>
                                    Math.min(
                                      prev + 1,
                                      assessmentData!.questions.length - 1
                                    )
                                  );
                                } 
                              } catch(err) {
                                console.log(err);
                              }
                            }}
                            loading = {submitionIsLoading}
                          >
                            {assessmentData!.questions.length - 1 === activeQuestion
                              ? "Submit"
                              : "Next"}
                          </Button>
                        )}
                      </div>
                    </section>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
