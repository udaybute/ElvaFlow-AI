'use client';

import { useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Sparkles, X, AlertCircle } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { InputForm } from '@/components/InputForm';
import { OutputPreview } from '@/components/OutputPreview';
import { ImageGallery } from '@/components/ImageGallery';
import { PostHistory } from '@/components/PostHistory';
import { AnimatedBackground } from '@/components/ui/AnimatedBackground';
import { ProfileSettings } from '@/components/ui/ProfileSettings';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { KeyboardHints } from '@/components/ui/KeyboardHints';
import { useAppStore } from '@/lib/store';
import { GeneratedPost } from '@/types';

function ErrorBanner({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      className="rounded-xl bg-red-500/10 border border-red-500/25 px-4 py-3 text-sm text-red-400 flex items-center justify-between gap-3 backdrop-blur-sm"
    >
      <div className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4 flex-shrink-0" />
        <span>{message}</span>
      </div>
      <button onClick={onDismiss} className="text-red-400/60 hover:text-red-400 transition-colors flex-shrink-0">
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  );
}

export default function Home() {
  const {
    topic, postType, tone, length,
    currentPost, variations, selectedVariation,
    editedContent, isEditing,
    postHistory, images,
    isGeneratingPost, isGeneratingImage,
    postError, imageError,
    remainingPosts, remainingImages,
    streamingContents, variationProgress,
    profile, savedHashtags,
    setTopic, setPostType, setTone, setLength,
    setSelectedVariation, setEditedContent, setIsEditing, saveEditedContent,
    generatePost, generateImage,
    deleteCurrentPost, deleteImage,
    loadHistory, refreshRateLimits,
    updateProfile, toggleSavedHashtag,
  } = useAppStore();

  useEffect(() => {
    loadHistory();
    refreshRateLimits();
  }, [loadHistory, refreshRateLimits]);

  const handleRestore = (post: GeneratedPost) => {
    useAppStore.setState({
      currentPost: post,
      variations: [post],
      selectedVariation: 0,
      editedContent: post.content,
      isEditing: false,
      topic: post.topic,
    });
  };

  // ── Keyboard shortcuts ───────────────────────────────────────────────────
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const tag = (e.target as HTMLElement).tagName;
    const isTyping = tag === 'INPUT' || tag === 'TEXTAREA';

    // Cmd/Ctrl + Enter → Generate
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isGeneratingPost && topic.trim() && remainingPosts > 0) {
        generatePost();
        toast.info('Generating post…', { duration: 1500 });
      }
      return;
    }

    if (isTyping) return;

    // E → Edit
    if (e.key === 'e' && currentPost && !isEditing) {
      setIsEditing(true);
      return;
    }
    // Esc → Cancel edit
    if (e.key === 'Escape' && isEditing) {
      setIsEditing(false);
      return;
    }
    // C → Copy current post
    if (e.key === 'c' && currentPost && !isEditing) {
      const text = `${currentPost.content}\n\n${currentPost.hashtags.join(' ')}`;
      navigator.clipboard.writeText(text);
      toast.success('Copied!', { duration: 1500 });
      return;
    }
    // 1/2/3 → Select variation
    if (['1', '2', '3'].includes(e.key) && variations.length > 0) {
      const idx = parseInt(e.key) - 1;
      if (variations[idx]) setSelectedVariation(idx);
      return;
    }
  }, [isGeneratingPost, topic, remainingPosts, generatePost, currentPost, isEditing, setIsEditing, variations, setSelectedVariation]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      <Toaster
        position="top-right"
        richColors
        toastOptions={{
          style: {
            background: 'oklch(0.14 0.025 265)',
            border: '1px solid oklch(1 0 0 / 10%)',
            color: 'oklch(0.94 0.01 265)',
          },
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/6 bg-[oklch(0.09_0.02_265/85%)] backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-[0_0_16px_oklch(0.65_0.22_265/40%)]">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-base font-extrabold gradient-text-blue leading-none tracking-tight">ElvaFlow AI</h1>
              <p className="text-[10px] text-white/30 leading-none mt-0.5 tracking-wide">by Elvatrixa</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1.5 text-[11px] font-semibold text-green-400 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1.5">
              <Sparkles className="h-3 w-3" />
              100% Free
            </span>
            <KeyboardHints />
            <ThemeToggle />
            <ProfileSettings profile={profile} onChange={updateProfile} />
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          <div className="inline-flex items-center gap-2 text-xs font-semibold bg-primary/10 border border-primary/20 text-primary rounded-full px-4 py-1.5">
            <Sparkles className="h-3 w-3" />
            AI-Powered LinkedIn Content
          </div>
          <h2 className="text-4xl sm:text-5xl font-black text-white/95 tracking-tight leading-[1.1]">
            Generate LinkedIn Posts{' '}
            <span className="gradient-text">with AI</span>
          </h2>
          <p className="text-white/45 text-base max-w-lg mx-auto leading-relaxed">
            3 unique variations · engagement scoring · editable preview · banner creator — all free.
          </p>
        </motion.div>
      </section>

      {/* Error banners */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-2 mb-2">
        <AnimatePresence>
          {postError && (
            <ErrorBanner key="post-error" message={postError} onDismiss={() => useAppStore.setState({ postError: null })} />
          )}
          {imageError && (
            <ErrorBanner key="image-error" message={imageError} onDismiss={() => useAppStore.setState({ imageError: null })} />
          )}
        </AnimatePresence>
      </div>

      {/* Main grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-4 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="space-y-5">
          <InputForm
            topic={topic}
            postType={postType}
            tone={tone}
            length={length}
            isLoading={isGeneratingPost}
            remainingPosts={remainingPosts}
            savedHashtags={savedHashtags}
            onTopicChange={setTopic}
            onPostTypeChange={setPostType}
            onToneChange={setTone}
            onLengthChange={setLength}
            onGenerate={generatePost}
            onInsertHashtag={(tag) => setTopic(topic ? `${topic} ${tag}` : tag)}
            onRemoveHashtag={toggleSavedHashtag}
          />
          <PostHistory history={postHistory} onRestore={handleRestore} onRefresh={loadHistory} />
        </div>

        <div className="space-y-5">
          <OutputPreview
            post={currentPost}
            variations={variations}
            selectedVariation={selectedVariation}
            editedContent={editedContent}
            isEditing={isEditing}
            isLoading={isGeneratingPost}
            streamingContents={streamingContents}
            variationProgress={variationProgress}
            profile={profile}
            savedHashtags={savedHashtags}
            onSelectVariation={setSelectedVariation}
            onEditedContentChange={setEditedContent}
            onStartEditing={() => setIsEditing(true)}
            onSaveEdit={saveEditedContent}
            onCancelEdit={() => setIsEditing(false)}
            onDelete={deleteCurrentPost}
            onToggleSavedHashtag={toggleSavedHashtag}
          />
          <ImageGallery
            postContent={currentPost?.content ?? topic}
            images={images}
            isLoading={isGeneratingImage}
            remainingImages={remainingImages}
            onGenerate={generateImage}
            onDelete={deleteImage}
          />
        </div>
      </main>

      <footer className="text-center pb-8 text-[11px] text-white/20">
        ElvaFlow AI by Elvatrixa · Built with Next.js, Groq &amp; Canvas · Zero Cost Architecture
      </footer>
    </div>
  );
}
