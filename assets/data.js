/*
 * Site content. Edit this file to update the homepage; no build step needed.
 *
 *   news         newest first; items older than `newsFoldBefore` fold away
 *   pubs         newest first. `lead: true` marks first and co-first author papers.
 *                Authors are full names in paper order; add "*" for equal contribution.
 *   impact       flagship systems; metrics marked `live` refresh from GitHub on load
 *   repos        smaller projects; stars are fetched live, `stars` is the fallback
 *   background   shown only when showBackground is true
 */
window.SITE = {
  me: "Huadai Liu",
  showBackground: false,
  newsFoldBefore: 2026,

  themes: [
    {
      title: "Audio language models",
      keywords: "Continuous autoregressive modeling \u00b7 LLM-based speech synthesis \u00b7 unified speech, sound and music",
      text: "Language models that generate audio directly: next-token prediction over continuous latents with a flow-matching head, so that one model covers speech, sound and music, and streaming speech synthesis built on a pre-trained LLM.",
      works: ["audiocalm", "cosyvoice2"],
    },
    {
      title: "Multimodal LLMs: reasoning and evaluation",
      keywords: "Chain-of-thought planning \u00b7 streaming multi-stream understanding \u00b7 spatial and emotional reasoning",
      text: "Multimodal LLMs as reasoners over video and audio: chain-of-thought plans that drive what a generator produces, and benchmarks that measure multi-stream streaming understanding, all-scale spatial reasoning and emotional intelligence.",
      works: ["thinksound", "xstream", "spacevista", "mmeemotion"],
    },
    {
      title: "Post-training and alignment",
      keywords: "Reinforcement learning (GRPO) \u00b7 decomposed rewards \u00b7 multi-teacher on-policy distillation",
      text: "Aligning a pre-trained generator with what people intend: multi-reward GRPO for flow-matching models guided by decomposed chain-of-thought, and distilling several specialist teachers into one controllable student with on-policy supervision.",
      works: ["prismaudio", "mosaicaudio"],
    },
    {
      title: "Latent representations and fast sampling",
      keywords: "Audio VAEs \u00b7 rate\u2013distortion\u2013regularity \u00b7 rectified flow \u00b7 consistency distillation",
      text: "The layer underneath diffusion and flow-based generation: latent spaces that are compact yet easy for these models to learn, and samplers that cut generation to one to four steps without losing fidelity.",
      works: ["starvae", "flashaudio", "audiolcm", "prodiff"],
    },
  ],

  news: [
    { year: 2026, venue: "NeurIPS 2026", text: "<a href=\"https://audiocalm-project.github.io/\">AudioCALM</a> accepted." },
    { year: 2026, venue: "EMNLP 2026", text: "<a href=\"https://openreview.net/forum?id=cEsbadnnl2\">MosaicAudio</a> accepted." },
    { year: 2026, venue: "ECCV 2026", text: "Outstanding Reviewer Award; <a href=\"https://peiwensun2000.github.io/xstream/\">X-Stream</a> (co-first author) accepted." },
    { year: 2026, venue: "ACL Rolling Review", text: "Serving as Area Chair." },
    { year: 2026, venue: "ICML 2026", text: "<a href=\"https://star-vae.github.io/\">STAR-VAE</a> and <a href=\"https://arxiv.org/abs/2510.09606\">SpaceVista</a> accepted." },
    { year: 2026, venue: "ACL 2026 Findings", text: "One co-authored paper accepted." },
    { year: 2026, venue: "ICLR 2026", text: "<a href=\"https://prismaudio-project.github.io/\">PrismAudio</a> and <a href=\"https://arxiv.org/abs/2508.09210\">MME-Emotion</a> accepted." },
    { year: 2025, venue: "NeurIPS 2025", text: "<a href=\"https://arxiv.org/abs/2506.21448\">ThinkSound</a> accepted." },
    { year: 2025, venue: "ACM MM 2025", text: "<a href=\"https://arxiv.org/abs/2407.13220\">MEDIC</a> selected for oral presentation." },
    { year: 2025, venue: "ACL 2025", text: "<a href=\"https://aclanthology.org/2025.acl-long.673/\">FlashAudio</a>: oral presentation and Senior Area Chair Highlight." },
    { year: 2025, venue: "ICML 2025", text: "<a href=\"https://arxiv.org/abs/2504.14906\">OmniAudio</a> accepted." },
  ],

  highlights: [
    {
      id: "audiocalm",
      what: "One autoregressive language model for speech, sound and music that predicts continuous latents instead of quantized tokens.",
      how: "A flow-matching head replaces the softmax, so the language model predicts rectified-flow velocities instead of token probabilities. Block-causal attention allows streaming and arbitrary length, and an asymmetric mixture of modality experts adds speech capacity without slowing sound or music.",
      result: "One jointly trained model matches modality-specific state of the art in speech, sound and music, and beats earlier unified models.",
      figure: { src: "research/audiocalm-overview.webp", alt: "AudioCALM: causal transformer with a flow-matching head, block-causal attention and modality experts" },
      demo: {
        type: "audio",
        clips: [
          { label: "Speech", src: "media/audiocalm-speech.mp3", spec: "media/audiocalm-speech-spec", dur: 6.55, caption: "Zero-shot TTS (LibriTTS): “This is my schooling, major; and if one neglects the book, there is little chance of learning from the open land of Providence.”" },
          { label: "Sound", src: "media/audiocalm-sound.mp3", spec: "media/audiocalm-sound-spec", dur: 6.64, caption: "Text-to-audio (AudioCaps): “An engine revving followed by horn honking and more revving.”" },
          { label: "Music", src: "media/audiocalm-music.mp3", spec: "media/audiocalm-music-spec", dur: 9.98, caption: "Text-to-music (Song Describer): “A soft, calming jazz piece with a leading guitar, suitable for a cafe.”" },
        ],
      },
    },
    {
      id: "prismaudio",
      what: "Multi-reward reinforcement learning for flow-matching generators.",
      how: "Planning is split into semantic, temporal, aesthetic and spatial chains of thought, each scored by its own reward. Fast-GRPO mixes ODE and SDE sampling so that GRPO on a flow model stays affordable.",
      result: "State of the art on all four axes on VGGSound and on AudioCanvas, an out-of-domain benchmark released with the paper.",
      figure: { src: "research/prismaudio-framework.webp", alt: "PrismAudio: four chain-of-thought modules, each paired with a reward" },
      demo: { type: "link", label: "Sora 2 and Veo 3 soundtracks", href: "https://prismaudio-project.github.io/" },
    },
    {
      id: "thinksound",
      what: "Chain-of-thought from a multimodal LLM as the control signal for generation.",
      how: "A multimodal LLM writes an AudioCoT plan that ties each visual event to the sound it should make. A flow-matching model follows the plan, and the same interface supports object-level refinement and editing by instruction.",
      result: "State of the art on VGGSound video-to-audio and on reasoning metrics, with strong out-of-distribution results.",
      figure: { src: "research/thinksound-teaser.webp", alt: "ThinkSound: reasoning-guided generation, object refinement and editing" },
      demo: { type: "video", label: "Veo 3 video, ThinkSound soundtrack", src: "media/thinksound-veo3.mp4", poster: "media/thinksound-veo3-poster.jpg", dur: 16 },
    },
    {
      id: "starvae",
      what: "What makes a latent space easy for diffusion and flow models to learn: a rate–distortion–regularity view of audio VAEs.",
      how: "The paper formalizes the three-way trade-off in audio VAEs and allocates KL per channel, so semantic structure and stochastic texture land in subspaces whose capacity matches them. A CNN–Mamba backbone covers local detail and long context.",
      result: "State-of-the-art reconstruction, and better text-to-audio generation on AudioCaps and Song Describer when a generator is trained on these latents.",
      figure: { src: "research/starvae-framework.webp", alt: "STAR-VAE framework with channel-indexed KL regularization" },
      demo: {
        type: "audio",
        clips: [
          { label: "Text-to-audio", src: "media/starvae-rain.mp3", spec: "media/starvae-rain-spec", dur: 9.98, caption: "Generated on STAR-VAE latents: “Rain pitter-patters as thunder cracks and the wind blows.”" },
        ],
      },
    },
  ],

  efficient: [
    {
      id: "xstream",
      role: "Co-first author",
      text: "A benchmark for MLLMs that must follow several live streams at once, across multi-window, multi-view and multi-device settings, with MLLMs analysed as signal multiplexers.",
      figure: "4,220 QA pairs over 932 videos and 11 subtasks; state-of-the-art MLLMs score about 50% and rarely act proactively.",
    },
    {
      id: "flashaudio",
      text: "Rectified flow made to work in a single step, through bifocal timestep sampling, immiscible noise–data pairing and anchored guidance.",
      figure: "400× real time in one step on one RTX 4090, ahead of diffusion baselines that use hundreds of steps.",
    },
    {
      id: "audiolcm",
      text: "Guided latent consistency distillation that keeps text-to-audio quality at two to four sampling steps.",
      figure: "333× faster than real time on a single GPU; 1.1K+ GitHub stars.",
    },
  ],

  pubs: [
    { id: "audiocalm", lead: true, year: 2026, venue: "NeurIPS 2026", title: "AudioCALM: Continuous Autoregressive Language Modeling for Universal Audio Generation", authors: ["Huadai Liu", "Kaicheng Luo", "Wen Wang", "Qian Chen", "Bin Ma", "Xiangang Li", "Wei Xue"], links: { Paper: "https://arxiv.org/abs/2606.23080", Project: "https://audiocalm-project.github.io/" } },
    { id: "starvae", lead: true, year: 2026, venue: "ICML 2026", title: "STAR-VAE: Structured Topology-Aware Regularization for Audio Reconstruction and Generation", authors: ["Huadai Liu", "Wen Wang", "Kaicheng Luo", "Qian Chen", "Xiangang Li", "Wei Xue"], links: { Paper: "https://arxiv.org/abs/2606.23064", Project: "https://star-vae.github.io/" } },
    { id: "prismaudio", lead: true, year: 2026, venue: "ICLR 2026", title: "PrismAudio: Decomposed Chain-of-Thoughts and Multi-dimensional Rewards for Video-to-Audio Generation", authors: ["Huadai Liu", "Kaicheng Luo", "Wen Wang", "Qian Chen", "Peiwen Sun", "Rongjie Huang", "Xiangang Li", "Jieping Ye", "Wei Xue"], links: { Paper: "https://arxiv.org/abs/2511.18833", Code: "https://github.com/QwenAudio/ThinkSound", Project: "https://prismaudio-project.github.io/" } },
    { id: "mosaicaudio", lead: true, year: 2026, venue: "EMNLP 2026", title: "MosaicAudio: Multi-Teacher On-Policy Distillation for Controllable Video-to-Audio Generation", authors: ["Huadai Liu", "Peiwen Sun", "Qian Chen", "Wen Wang", "Bin Ma", "Xiangang Li", "Wei Xue"], links: { Paper: "https://openreview.net/forum?id=cEsbadnnl2" } },
    { id: "xstream", lead: true, year: 2026, venue: "ECCV 2026", title: "X-Stream: Exploring MLLMs as Multiplexers for Multi-Stream Understanding", authors: ["Peiwen Sun*", "Xudong Lu*", "Huadai Liu*", "Yang Bo", "Dongming Wu", "Huankang Guan", "Minghong Cai", "Jinpeng Chen", "Xintong Guo", "Shuhan Li", "Fang Liu", "Rui Liu", "Xiangyu Yue"], links: { Paper: "https://arxiv.org/abs/2606.02482", Project: "https://peiwensun2000.github.io/xstream/" } },
    { id: "spacevista", year: 2026, venue: "ICML 2026", title: "SpaceVista: All-Scale Visual Spatial Reasoning from mm to km", authors: ["Peiwen Sun", "Shiqiang Lang", "Dongming Wu", "Yi Ding", "Kaituo Feng", "Huadai Liu", "Zhen Ye", "Rui Liu", "Yun-Hui Liu", "Jianan Wang", "Xiangyu Yue"], links: { Paper: "https://arxiv.org/abs/2510.09606", Project: "https://peiwensun2000.github.io/mm2km/" } },
    { id: "mmeemotion", year: 2026, venue: "ICLR 2026", title: "MME-Emotion: A Holistic Evaluation Benchmark for Emotional Intelligence in Multimodal Large Language Models", authors: ["Fan Zhang", "Zebang Cheng", "Chong Deng", "Haoxuan Li", "Zheng Lian", "Qian Chen", "Huadai Liu", "Wen Wang", "Yi-Fan Zhang", "Renrui Zhang", "Ziyu Guo", "Zhihong Zhu", "Hao Wu", "Haixin Wang", "Yefeng Zheng", "Xiaojiang Peng", "Xian Wu", "Kun Wang", "Xiangang Li", "Jieping Ye", "Pheng-Ann Heng"], links: { Paper: "https://arxiv.org/abs/2508.09210" } },
    { id: "thinksound", lead: true, year: 2025, venue: "NeurIPS 2025", title: "ThinkSound: Chain-of-Thought Reasoning in Multimodal Large Language Models for Audio Generation and Editing", authors: ["Huadai Liu", "Kaicheng Luo", "Jialei Wang", "Wen Wang", "Qian Chen", "Zhou Zhao", "Wei Xue"], links: { Paper: "https://arxiv.org/abs/2506.21448", Code: "https://github.com/QwenAudio/ThinkSound", Project: "https://thinksound-project.github.io/" } },
    { id: "omniaudio", lead: true, year: 2025, venue: "ICML 2025", title: "OmniAudio: Generating Spatial Audio from 360-Degree Video", authors: ["Huadai Liu", "Tianyi Luo", "Kaicheng Luo", "Qikai Jiang", "Peiwen Sun", "Jialei Wang", "Rongjie Huang", "Qian Chen", "Wen Wang", "Xiangtai Li", "Shiliang Zhang", "Zhijie Yan", "Zhou Zhao", "Wei Xue"], links: { Paper: "https://arxiv.org/abs/2504.14906", Code: "https://github.com/liuhuadai/OmniAudio", Project: "https://omniaudio-360v2sa.github.io/" } },
    { id: "flashaudio", lead: true, year: 2025, venue: "ACL 2025", note: "Oral · SAC Highlight", title: "FlashAudio: Rectified Flow for Fast and High-Fidelity Text-to-Audio Generation", authors: ["Huadai Liu", "Jialei Wang", "Rongjie Huang", "Yang Liu", "Heng Lu", "Zhou Zhao", "Wei Xue"], links: { Paper: "https://aclanthology.org/2025.acl-long.673/", Code: "https://github.com/liuhuadai/FlashAudio" } },
    { id: "medic", lead: true, year: 2025, venue: "ACM MM 2025", note: "Oral", title: "MEDIC: Zero-shot Music Editing with Disentangled Inversion Control", authors: ["Huadai Liu", "Jialei Wang", "Xiangtai Li", "Wen Wang", "Qian Chen", "Rongjie Huang", "Yang Liu", "Jiayang Xu", "Zhou Zhao"], links: { Paper: "https://arxiv.org/abs/2407.13220", Code: "https://github.com/liuhuadai/MEDIC" } },
    { id: "bewo", year: 2025, venue: "ICLR 2025", title: "Both Ears Wide Open: Towards Language-Driven Spatial Audio Generation", authors: ["Peiwen Sun", "Sitong Cheng", "Xiangtai Li", "Zhen Ye", "Huadai Liu", "Honggang Zhang", "Wei Xue", "Yike Guo"], links: { Paper: "https://arxiv.org/abs/2410.10676" } },
    { id: "audiolcm", lead: true, year: 2024, venue: "ACM MM 2024", title: "AudioLCM: Efficient and High-Quality Text-to-Audio Generation with Minimal Inference Steps", authors: ["Huadai Liu", "Rongjie Huang", "Yang Liu", "Hengyuan Cao", "Jialei Wang", "Xize Cheng", "Siqi Zheng", "Zhou Zhao"], links: { Paper: "https://arxiv.org/abs/2406.00356", Code: "https://github.com/Text-to-Audio/AudioLCM" } },
    { id: "cosyvoice2", year: 2024, venue: "Technical report", title: "CosyVoice 2: Scalable Streaming Speech Synthesis with Large Language Models", authors: ["Zhihao Du", "Yuxuan Wang", "Qian Chen", "Xian Shi", "Xiang Lv", "Tianyu Zhao", "Zhifu Gao", "Yexin Yang", "Changfeng Gao", "Hui Wang", "Fan Yu", "Huadai Liu", "Zhengyan Sheng", "Yue Gu", "Chong Deng", "Wen Wang", "Shiliang Zhang", "Zhijie Yan", "Jingren Zhou"], links: { Paper: "https://arxiv.org/abs/2412.10117", Code: "https://github.com/QwenAudio/CosyVoice" } },
    { id: "wav2sql", lead: true, year: 2024, venue: "Findings of ACL 2024", title: "Wav2SQL: Direct Generalizable Speech-To-SQL Parsing", authors: ["Huadai Liu", "Rongjie Huang", "Jinzheng He", "Gang Sun", "Ran Shen", "Xize Cheng", "Zhou Zhao"], links: { Paper: "https://aclanthology.org/2024.findings-acl.251/" } },
    { id: "antcritic", lead: true, year: 2024, venue: "LREC-COLING 2024", title: "AntCritic: Argument Mining for Free-Form and Visually-Rich Financial Comments", authors: ["Huadai Liu", "Wenqiang Xu", "Xuan Lin", "Jingjing Huo", "Hong Chen", "Zhou Zhao"], links: { Paper: "https://aclanthology.org/2024.lrec-main.117/" } },
    { id: "transpeech", lead: true, year: 2023, venue: "ICLR 2023", title: "TranSpeech: Speech-to-Speech Translation With Bilateral Perturbation", authors: ["Rongjie Huang*", "Jinglin Liu*", "Huadai Liu*", "Yi Ren", "Lichao Zhang", "Jinzheng He", "Zhou Zhao"], links: { Paper: "https://arxiv.org/abs/2205.12523" } },
    { id: "vittts", lead: true, year: 2023, venue: "EMNLP 2023", title: "ViT-TTS: Visual Text-to-Speech with Scalable Diffusion Transformer", authors: ["Huadai Liu", "Rongjie Huang", "Xuan Lin", "Wenqiang Xu", "Maozong Zheng", "Hong Chen", "Jinzheng He", "Zhou Zhao"], links: { Paper: "https://aclanthology.org/2023.emnlp-main.990/", Code: "https://github.com/liuhuadai/ViT-TTS" } },
    { id: "avtranspeech", lead: true, year: 2023, venue: "ACL 2023", title: "AV-TranSpeech: Audio-Visual Robust Speech-to-Speech Translation", authors: ["Rongjie Huang*", "Huadai Liu*", "Xize Cheng", "Yi Ren", "Linjun Li", "Zhenhui Ye", "Jinzheng He", "Lichao Zhang", "Jinglin Liu", "Xiang Yin", "Zhou Zhao"], links: { Paper: "https://aclanthology.org/2023.acl-long.479/" } },
    { id: "prodiff", lead: true, year: 2022, venue: "ACM MM 2022", title: "ProDiff: Progressive Fast Diffusion Model for High-Quality Text-to-Speech", authors: ["Rongjie Huang*", "Zhou Zhao", "Huadai Liu*", "Jinglin Liu", "Chenye Cui", "Yi Ren"], links: { Paper: "https://doi.org/10.1145/3503161.3547855" } },
  ],

  impact: [
    {
      repo: "QwenAudio/CosyVoice",
      id: "cosyvoice",
      name: "CosyVoice 2",
      role: "Core contributor",
      what: "Streaming, multilingual speech synthesis built on a pre-trained LLM backbone. A chunk-aware causal flow-matching decoder serves streaming and offline synthesis in one model, with human-parity naturalness and near-lossless quality in streaming mode.",
      mine: "Designed the rectified-flow inference path for the flow-matching decoder: a 5\u201310\u00d7 inference speed-up in production.",
      metrics: [
        { value: "23.9K", label: "GitHub stars", live: "stars" },
        { value: "2.7K", label: "forks", live: "forks" },
        { value: "480+", label: "paper citations" },
      ],
      links: { GitHub: "https://github.com/QwenAudio/CosyVoice", Paper: "https://arxiv.org/abs/2412.10117", Demos: "https://funaudiollm.github.io/cosyvoice2/" },
    },
    {
      repo: "QwenAudio/ThinkSound",
      id: "thinksound",
      name: "ThinkSound & PrismAudio",
      role: "Project lead",
      what: "An open framework for reasoning-guided video-to-audio generation and editing: models, the AudioCoT dataset, the AudioCanvas benchmark, and complete training and inference code.",
      mine: "Led the research, model development and open-source release for both papers.",
      metrics: [
        { value: "1.3K+", label: "GitHub stars", live: "stars" },
        { value: "1M+", label: "social-media views" },
        { value: "#3", label: "on Papers with Code trending" },
      ],
      note: "Covered by QbitAI and IT Home; weights on Hugging Face and ModelScope.",
      links: { GitHub: "https://github.com/QwenAudio/ThinkSound", "ThinkSound project": "https://thinksound-project.github.io/", "PrismAudio project": "https://prismaudio-project.github.io/" },
    },
  ],

  repos: [
    { repo: "Text-to-Audio/AudioLCM", name: "AudioLCM", role: "Project lead", text: "Few-step text-to-audio with latent consistency distillation.", stars: 1164 },
    { repo: "liuhuadai/OmniAudio", name: "OmniAudio", role: "Project lead", text: "Spatial audio generation from 360-degree video.", stars: 378 },
  ],

  honors: [
    { what: "Senior Area Chair Highlight, ACL 2025", detail: "FlashAudio" },
    { what: "Oral presentation, ACL 2025", detail: "FlashAudio" },
    { what: "Oral presentation, ACM MM 2025", detail: "MEDIC" },
    { what: "Outstanding Reviewer, ECCV 2026", detail: "" },
    { what: "National Scholarship", detail: "2023" },
    { what: "Outstanding Graduate of Zhejiang Province", detail: "2024" },
  ],

  service: [
    { role: "Area Chair", where: "ACL Rolling Review (2026)" },
    { role: "Conference reviewer", where: "NeurIPS, ICML, ICLR, ACL, EMNLP, CVPR, ECCV, AAAI, ACM Multimedia" },
    { role: "Journal reviewer", where: "IEEE/ACM Transactions on Audio, Speech, and Language Processing" },
  ],

  background: [
    { when: "2021 – 2024", what: "M.S. in Artificial Intelligence", where: "Zhejiang University" },
    { when: "2016 – 2020", what: "B.S. in Electronic Information", where: "Shandong University" },
  ],
};
