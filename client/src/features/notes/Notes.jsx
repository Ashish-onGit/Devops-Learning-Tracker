import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Tag,
  BookOpen,
  Download,
  Eye,
  Code,
  Save,
  Calendar,
} from "lucide-react";
import { addNote, updateNote, deleteNote } from "../../store/slices/notesSlice";
import { useToast } from "../../hooks/useToast";
import { useConfirm } from "../../hooks/useConfirm";
import ReactMarkdown from "react-markdown";

const Notes = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const confirm = useConfirm();

  // Redux state
  const notes = useSelector((state) => state.notes?.notes || []);

  // Component state
  const [selectedNoteId, setSelectedNoteId] = useState(null);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Editor state
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Learning Notes");
  const [tags, setTags] = useState("");
  const [editorMode, setEditorMode] = useState("edit"); // edit, preview

  const textareaRef = useRef(null);

  // Auto-resize the textarea while typing (clamped between 180px and 500px)
  useEffect(() => {
    if (textareaRef.current && editorMode === "edit") {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      const newHeight = Math.min(Math.max(scrollHeight, 180), 500);
      textareaRef.current.style.height = `${newHeight}px`;
      
      if (scrollHeight > 500) {
        textareaRef.current.style.overflowY = "auto";
      } else {
        textareaRef.current.style.overflowY = "hidden";
      }
    }
  }, [content, editorMode, selectedNoteId]);

  // Set initial selected note
  useEffect(() => {
    if (notes.length > 0 && !selectedNoteId) {
      handleSelectNote(notes[0]);
    }
  }, [notes]);

  const handleSelectNote = (note) => {
    setSelectedNoteId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category || "Learning Notes");
    setTags(note.tags ? note.tags.join(", ") : "");
    setEditorMode("edit");
  };

  const handleCreateNewNote = () => {
    const defaultTitle = "Untitled Note";
    const defaultContent =
      "# My DevOps Note\n\nType your notes here. You can use **bold text**, *italics*, or code snippets:\n```bash\nkubectl get pods\n```";

    // Dispatch default note
    dispatch(
      addNote({
        title: defaultTitle,
        content: defaultContent,
        category: "Learning Notes",
        tags: ["new"],
      }),
    );

    toast.success("Note added successfully");
  };

  const handleSaveCurrentNote = () => {
    if (!selectedNoteId) return;

    dispatch(
      updateNote({
        id: selectedNoteId,
        title,
        content,
        category,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      }),
    );

    toast.success("Note saved successfully");
  };

  const handleDeleteNote = async (id) => {
    const targetNote = notes.find((n) => n.id === id);
    const titleText = targetNote
      ? `Delete Note "${targetNote.title}"?`
      : "Delete Note?";

    const approved = await confirm({
      title: titleText,
      description:
        "This action cannot be undone. The note will be permanently removed from your local database.",
      variant: "danger",
    });

    if (approved) {
      dispatch(deleteNote(id));
      toast.success("Note deleted successfully");
      if (selectedNoteId === id) {
        setSelectedNoteId(null);
        setTitle("");
        setContent("");
        setCategory("Learning Notes");
        setTags("");
      }
    }
  };

  const handleExportNote = () => {
    if (!title || !content) return;

    const fileContent = `---
title: ${title}
category: ${category}
tags: ${tags}
date: ${new Date().toDateString()}
---

${content}`;

    const blob = new Blob([fileContent], {
      type: "text/markdown;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `${title.toLowerCase().replace(/[^a-z0-9]+/g, "_")}.md`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Note exported as Markdown file");
  };

  // Categories list
  const categories = [
    "All",
    "Learning Notes",
    "Interview Notes",
    "Cheat Sheets",
    "Commands",
  ];

  // Filtering notes
  const filteredNotes = notes.filter((n) => {
    const matchesSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.content.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      activeCategory === "All" || n.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const activeNote = notes.find((n) => n.id === selectedNoteId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-140px)]">
      {/* Column 1: Notes List */}
      <div className="flex flex-col rounded-xl glass-panel overflow-hidden h-full">
        {/* Search & Add Bar */}
        <div className="p-4 border-b border-slate-200/50 dark:border-[#202020] space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm">Notes Library</h3>
            <button
              onClick={handleCreateNewNote}
              className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1 text-[10px] font-bold shadow-sm shadow-blue-500/10"
            >
              <Plus className="w-3.5 h-3.5" /> Add Note
            </button>
          </div>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-200/50 dark:border-[#202020] bg-slate-100/50 dark:bg-[#050505] focus:ring-1 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="px-4 py-2 border-b border-slate-200/50 dark:border-[#202020] flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none select-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1 rounded-full text-[10px] font-bold border transition ${
                activeCategory === cat
                  ? "bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-950 dark:border-white"
                  : "text-slate-500 border-slate-200/50 dark:border-[#202020] hover:bg-slate-100 dark:hover:bg-[#151515]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Notes Items List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-200/50 dark:divide-[#202020]">
          {filteredNotes.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              No notes found in this category.
            </div>
          ) : (
            filteredNotes.map((n) => {
              const isSelected = n.id === selectedNoteId;
              const formattedDate = new Date(n.updatedAt).toLocaleDateString();

              return (
                <div
                  key={n.id}
                  onClick={() => handleSelectNote(n)}
                  className={`p-4 cursor-pointer text-left transition select-none flex flex-col justify-between h-24 ${
                    isSelected
                      ? "bg-blue-500/[0.03] border-l-4 border-blue-600"
                      : "hover:bg-slate-50 dark:hover:bg-[#151515]"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-4">
                      <h4 className="font-bold text-xs truncate max-w-[180px]">
                        {n.title}
                      </h4>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNote(n.id);
                        }}
                        className="text-slate-400 hover:text-red-500 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate mt-1">
                      {n.content.replace(/[#*`]/g, "")}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[9px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> {formattedDate}
                    </span>
                    <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-bold text-[8px]">
                      {n.category}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Column 2 & 3: Notes Editor & Preview */}
      <div className="lg:col-span-2 flex flex-col rounded-xl glass-panel overflow-hidden h-full">
        {selectedNoteId ? (
          <>
            {/* Editor toolbar header */}
            <div className="p-4 border-b border-slate-200/50 dark:border-[#202020] flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setEditorMode("edit")}
                  className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                    editorMode === "edit"
                      ? "bg-slate-100 dark:bg-[#1A1A1A] text-slate-900 dark:text-white"
                      : "text-slate-500"
                  }`}
                >
                  <Code className="w-4 h-4" /> Code Editor
                </button>
                <button
                  onClick={() => setEditorMode("preview")}
                  className={`p-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                    editorMode === "preview"
                      ? "bg-slate-100 dark:bg-[#1A1A1A] text-slate-900 dark:text-white"
                      : "text-slate-500"
                  }`}
                >
                  <Eye className="w-4 h-4" /> Live Preview
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportNote}
                  title="Export Note to .md File"
                  className="p-2 rounded-lg border border-slate-200/50 dark:border-[#202020] hover:bg-slate-50 dark:hover:bg-[#151515] text-slate-600 dark:text-slate-400 flex items-center justify-center"
                >
                  <Download className="w-4 h-4" />
                </button>
                <button
                  onClick={handleSaveCurrentNote}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm"
                >
                  <Save className="w-3.5 h-3.5" /> Save Edits
                </button>
              </div>
            </div>

            {/* Note details inputs */}
            <div className="p-4 border-b border-slate-200/50 dark:border-[#202020] bg-slate-50/20 dark:bg-slate-950/20 grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="md:col-span-2">
                <input
                  type="text"
                  placeholder="Note Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-transparent text-sm font-bold border-b border-slate-200/50 dark:border-[#202020] focus:border-blue-500 focus:outline-none py-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-transparent border border-slate-200/50 dark:border-[#202020] rounded px-2 py-1 text-xs focus:outline-none text-slate-800 dark:text-slate-200"
                >
                  <option value="Learning Notes" className="bg-white dark:bg-[#0A0A0A]">Learning Notes</option>
                  <option value="Interview Notes" className="bg-white dark:bg-[#0A0A0A]">Interview Notes</option>
                  <option value="Cheat Sheets" className="bg-white dark:bg-[#0A0A0A]">Cheat Sheets</option>
                  <option value="Commands" className="bg-white dark:bg-[#0A0A0A]">Commands</option>
                </select>
                <input
                  type="text"
                  placeholder="Tags (tag1, tag2)"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="bg-transparent border border-slate-200/50 dark:border-[#202020] rounded px-2 py-1 text-xs focus:outline-none truncate text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>

            {/* Editor Workspaces */}
            <div className="flex-1 p-4 overflow-y-auto">
              {editorMode === "edit" ? (
                <textarea
                  ref={textareaRef}
                  className="w-full bg-white dark:bg-[#0A0A0A] text-slate-800 dark:text-slate-200 resize-none border border-slate-200/50 dark:border-[#202020] rounded-lg p-3 outline-none font-mono text-xs leading-relaxed focus:ring-1 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all"
                  style={{ minHeight: "180px", maxHeight: "500px", height: "180px" }}
                  placeholder="# Welcome to your markdown editor..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              ) : (
                <div className="prose dark:prose-invert max-w-none text-xs leading-relaxed space-y-4">
                  <ReactMarkdown>{content}</ReactMarkdown>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center flex-1 text-slate-500 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300" />
            <div className="text-center">
              <h4 className="font-bold text-xs text-slate-650 dark:text-slate-400">
                No Note Selected
              </h4>
              <p className="text-[10px] text-slate-500 mt-1">
                Select a note from the left sidebar panel, or create a new note.
              </p>
            </div>
            <button
              onClick={handleCreateNewNote}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" /> Create First Note
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;
