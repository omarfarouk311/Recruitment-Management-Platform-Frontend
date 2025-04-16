import { AlertCircleIcon, CheckIcon, PlusIcon, TrashIcon } from "lucide-react";
import { useState, useEffect } from "react";
import Button from "../common/Button";
import UserNav from "../Header/UserNav";
import { DeleteDialog } from "./DeleteDialog";
import { InstructionsDialog } from "./InstructionsDialog";
import useStore from "../../stores/globalStore";
import { Timer } from "./Timer";
import SkeletonLoader from "../common/SkeletonLoader";

export const Assessment = () => {
  const [activeQuestion, setActiveQuestion] = useState(1);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const userRole = useStore.useUserRole();
  const [timeIsUp, setTimeIsUp] = useState(false);
  const assessmentData = useStore.useSelectedAssessment();
  const modifyQuestions = useStore.useAssessmentModifyQuestions();
  const submitAnswers = useStore.useAssessmentSubmitAnswers();
  const isLoading = useStore.useAssessmentIsLoading();

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
  }, [assessmentData?.questions, activeQuestion]);

  useEffect(() => {
    if (isLoading == false && assessmentData?.questions.length)
      setShowInstructionsModal(true);
    else if (assessmentData?.questions.length == 0) {
      modifyQuestions((_) => [
        { id: 1, text: "", answers: [""], correctAnswers: [] },
      ]);
      setActiveQuestion(0);
    }
  }, [isLoading]);

  useEffect(() => {
    if (timeIsUp) submitAnswers();
  }, [timeIsUp]);

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
          text: "",
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
          activeQuestion < q.id
            ? {
                ...q,
                id: q.id - 1,
              }
            : q
        );
      const newActiveQuestion = Math.min(
        activeQuestion - 1,
        newQuestions.length - 1
      );
      setActiveQuestion(newActiveQuestion < 0 ? 0 : newActiveQuestion);
      setShowDeleteModal(false);
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
      {userRole === "company" && (
        <div className="fixed top-0 w-full z-10">
          <UserNav />
        </div>
      )}

      <div
        className={`bg-[#fafbff] flex flex-row justify-center w-full min-h-screen ${
          userRole === "company" ? "pt-20" : ""
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
              {assessmentData?.questions.map((question, index) => (
                <div
                  key={question.id}
                  className="relative cursor-pointer"
                  onClick={() => setActiveQuestion(index)}
                >
                  {index === 0 && (
                    <div className="flex justify-center pt-4 pb-2">
                      <AlertCircleIcon
                        className="w-8 h-8 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowInstructionsModal(true);
                        }}
                      />
                    </div>
                  )}

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
                      {question.id}
                    </span>
                  </div>
                  <div className="w-full h-px bg-gray-300" />
                </div>
              ))}

              {userRole === "company" && (
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
                className={`pl-44 pr-20 ${
                  userRole === "company" ? "pt-8" : "pt-6"
                } w-full max-w-screen relative`}
              >
                <SkeletonLoader />
              </div>
            ) : (
              <div className="flex-1 pl-44 pr-20 py-8 relative">
                {userRole === "seeker" && (
                  <Timer
                    className="mr-16"
                    initialMinutes={assessmentData?.time || 0}
                    timeIsUp={timeIsUp}
                    setTimeIsUp={setTimeIsUp}
                  />
                )}
                {/* Question Header */}
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-500 text-3xl">
                    Question {activeQuestion + 1}
                  </h3>
                  {userRole === "company" && (
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
                  value={assessmentData?.questions[activeQuestion]?.text || ""}
                  onChange={(e) =>
                    modifyQuestions((questions) =>
                      questions.map((q, i) =>
                        i === activeQuestion
                          ? {
                              ...q,
                              text: e.target.value,
                            }
                          : q
                      )
                    )
                  }
                  className="w-full p-4 rounded-2xl border border-gray-300 shadow-md resize-none overflow-hidden 
                        whitespace-pre-wrap break-words text-2xl min-h-[60px]"
                  placeholder="Enter your question here..."
                  disabled={userRole === "seeker"}
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
                          key={i}
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
                              ].correctAnswers.includes(i) && (
                                <CheckIcon className="w-5 h-5" />
                              )}
                            </div>

                            {userRole === "company" ? (
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

                          {userRole === "company" && (
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
                    {userRole === "company" ? (
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
                        onClick={() => {
                          if (
                            assessmentData!.questions.length - 1 ===
                            activeQuestion
                          ) {
                            submitAnswers();
                          } else {
                            setActiveQuestion((prev) =>
                              Math.min(
                                prev + 1,
                                assessmentData!.questions.length - 1
                              )
                            );
                          }
                        }}
                      >
                        {assessmentData!.questions.length - 1 === activeQuestion
                          ? "Submit"
                          : "Next"}
                      </Button>
                    )}
                  </div>
                </section>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
