import { Plus, Trash2, Pencil } from "lucide-react";
import FilterDropdown from "../Filters/FilterDropdown";
import Button from "../common/Button";
import { useEffect, useState } from "react";
import { TemplateData } from "../../types/companyDashboard";
import Dashboard, { ColumnDef } from "../common/Dashboard";
import axios from "axios";
import { authRefreshToken } from "../../util/authUtils";
import { showErrorToast } from "../../util/errorHandler";
import config from "../../../config/config";

export default function CompanyTemplatesDashboard() {
    const [changed, setChanged] = useState(false);
    const [templatesData, setTemplatesData] = useState<TemplateData[]>([]);
    const [selectedTemplate, setSelectedTemplate] =
        useState<TemplateData | null>(null);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [sortBy, setSortBy] = useState<string>();

    async function handleOpenTemplate(id: number) {
        setChanged(false);
        setLoading(true);
        setSelectedTemplate(null);
        let res;
        try {
            try {
                res = await axios.get(
                    `${config.API_BASE_URL}/templates/template-details/${id}`,
                    {
                        params: {
                            simplified: true,
                        },
                    }
                );
            } catch (err) {
                if (axios.isAxiosError(err) && err.response?.status === 401) {
                    await authRefreshToken();
                    res = await axios.get(`/templates/template-details/${id}`, {
                        params: {
                            simplified: true,
                        },
                    });
                } else {
                    throw err;
                }
            }
            console.log(res);
            if (res.status === 200) {
                setSelectedTemplate({
                    id: id,
                    name: res.data.name,
                    content: res.data.description,
                });
            }
        } catch (err) {
            showErrorToast("Error fetching template");
            return;
        }
        setLoading(false);
    }

    async function handleDeleteTemplate(id: number) {
        try {
            await axios.delete(`${config.API_BASE_URL}/templates/${id}`);
            setTemplatesData((prev) =>
                prev.filter((template) => template.id !== id)
            );
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                await authRefreshToken();
                await handleDeleteTemplate(id);
            } else {
                showErrorToast("Error deleting template");
            }
        }
    }

    async function fetchTemplates(curPage?: number) {
        setLoading(true);
        try {
            let params: {page: number, sortBy?: string} = { page: curPage || page };
            if (sortBy) {
                params = {...params, sortBy};
            }
            const res = await axios.get(`${config.API_BASE_URL}/templates`, {
                params,
            });
            if (res.status === 200) {
                setTemplatesData((prev) => [
                    ...prev,
                    ...res.data.map(
                        (template: {
                            id: number;
                            name: string;
                            updated_at: string;
                        }) => ({
                            id: template.id,
                            name: template.name,
                            updatedAt: new Date(
                                template.updated_at
                            ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                            }),
                        })
                    ),
                ]);
                if (res.data.length === 0) {
                    setHasMore(false);
                }
                setPage((prev) => prev + 1);
            }
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                await authRefreshToken();
                await fetchTemplates();
            } else {
                showErrorToast("Error fetching templates");
            }
        }
        setLoading(false);
    }

    async function handleSaveTemplate() {
        if (!selectedTemplate) {
            showErrorToast("Error saving template");
            return;
        }
        setLoading(true);
        try {
            if (selectedTemplate.id) {
                let res = await axios.put(
                    `${config.API_BASE_URL}/templates/${selectedTemplate.id}`,
                    {
                        name: selectedTemplate.name,
                        description: selectedTemplate.content,
                    }
                );
                setTemplatesData((prev) =>
                    prev.map((template) => {
                        if (template.id === selectedTemplate.id) {
                            return {
                                ...template,
                                name: selectedTemplate.name,
                                updatedAt: new Date(res.data.data.updated_at).toLocaleDateString(
                                    "en-US",
                                    {
                                        year: "numeric",
                                        month: "2-digit",
                                        day: "2-digit",
                                    }
                                ),
                            };
                        }
                        return template;
                    })
                );
            } else {
                let res = await axios.post(`${config.API_BASE_URL}/templates`, {
                    name: selectedTemplate.name,
                    description: selectedTemplate.content,
                });
                setTemplatesData((prev) => [
                    {
                        id: res.data.data.id,
                        name: selectedTemplate.name,
                        updatedAt: new Date(res.data.data.updated_at).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "2-digit",
                            day: "2-digit",
                        }),
                    },
                    ...prev,
                ]);
            }
            setChanged(false);
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 401) {
                await authRefreshToken();
                await handleSaveTemplate();
            } else {
                showErrorToast("Error saving template");
            }
        }
        setLoading(false);
    }

    function handleAddTemplate() {
        setSelectedTemplate({
            name: "",
            content: "",
        });
    }

    useEffect(() => {
        fetchTemplates(1);

        return () => {
            setTemplatesData([]);
            setSelectedTemplate(null);
            setHasMore(true);
            setPage(1);
        };
    }, [sortBy]);

    const columns: ColumnDef<TemplateData>[] = [
        {
            key: "name",
            header: "Template Name",
        },
        {
            key: "updatedAt",
            header: "Updated At",
        },
        {
            key: "actions",
            header: "Actions",
            render: (row) => {
                return (
                    <div
                        className="flex flex-row items-center justify-center space-x-8"
                        style={{ textAlign: "center" }}
                    >
                        <Pencil
                            className="h-5 w-5 cursor-pointer hover:text-blue-500"
                            onClick={async () => {
                                if (row.id) {
                                    await handleOpenTemplate(row.id);
                                } else {
                                    showErrorToast("Error fetching template");
                                }
                            }}
                        />
                        <Trash2
                            className="h-5 w-5 cursor-pointer text-red-400 hover:text-red-600 active:text-red-700"
                            onClick={async () => {
                                if (row.id) {
                                    await handleDeleteTemplate(row.id);
                                } else {
                                    showErrorToast("Error fetching template");
                                }
                            }}
                        />
                    </div>
                );
            },
        },
    ];

    return (
        <div className="mx-auto grid grid-cols-1 gap-6 px-6 md:grid-cols-2 max-h-[700px]">
            {/* Left Panel - Templates List */}
            <div className="rounded-3xl border border-[#e7e7e7] bg-white px-6 pt-6 shadow-sm">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-[#000000]">
                        Templates
                    </h1>
                    <div className="flex items-center gap-4">
                        <FilterDropdown
                            selectedValue={sortBy || ""}
                            label="Sort By"
                            options={[
                                { value: "-1", label: "Newer" },
                                { value: "1", label: "Older" },
                            ]}
                            onSelect={async (value) => {
                                setSortBy(value);
                            }}
                        />
                        <button className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-[#f2f2f2]" onClick={handleAddTemplate}>
                            <Plus className="h-5 w-5 text-[#292d32]" />
                        </button>
                    </div>
                </div>
                <div className="overflow-y-auto h-[580px]">
                    <Dashboard
                        columns={columns}
                        useData={() => templatesData}
                        useFetchData={() => fetchTemplates}
                        useHasMore={() => hasMore}
                        useIsLoading={() => loading}
                    />
                </div>
            </div>

            {/* Right Panel - New Template Form */}
            <div className="rounded-3xl border min-h-[600px] border-[#e7e7e7] bg-white px-6 pt-6 shadow-sm h-full">
                {selectedTemplate ? (
                    <>
                        <div className="mb-6">
                            <input
                                type="text"
                                className="w-1/2 inline-block rounded-lg border border-[#e7e7e7] bg-white px-4 py-2 text-lg font-medium text-[#000000]"
                                placeholder="Template Name"
                                value={selectedTemplate.name}
                                onChange={(e) => {
                                    setSelectedTemplate({
                                        ...selectedTemplate,
                                        name: e.target.value,
                                    });
                                    setChanged(true);
                                }}
                            />
                        </div>

                        <div className="mb-6">
                            <p className="text-[#292d32]">
                                Enter your job offer template here, note that
                                you must place placeholders between{" "}
                                <span className="font-medium">{"{{}}"}</span>{" "}
                                and the recruiter will fill them
                            </p>
                            <textarea
                                className="w-full rounded-lg border border-[#e7e7e7] p-4 text-[#292d32] font-sans"
                                rows={8}
                                value={selectedTemplate.content}
                                onChange={(e) => {
                                    setSelectedTemplate({
                                        ...selectedTemplate,
                                        content: e.target.value,
                                    });
                                    setChanged(true);
                                }}
                                style={{ whiteSpace: "pre-line" }}
                            />
                        </div>

                        <div>
                            <Button
                                className={`w-full ${
                                    !changed
                                        ? "opacity-50 cursor-not-allowed pointer-events-none"
                                        : ""
                                }`}
                                disabled={!changed}
                                onClick={async () => {
                                    await handleSaveTemplate();
                                }}
                                loading={loading}
                            >
                                Save
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <p className="text-[#292d32]">
                            Select a template to edit
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
