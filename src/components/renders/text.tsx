import { QuerySpore } from '@/hooks/query/type';
import {
  AspectRatio,
  Box,
  Textarea,
  createStyles,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { useRemark } from 'react-remark';

export interface TextSporeRenderProps {
  spore: QuerySpore;
  ratio?: number;
  size?: 'sm' | 'md' | 'lg';
}

const useStyles = createStyles((theme, props: TextSporeRenderProps) => ({
  wrapper: {
    width: '100%',
    height: '100%',
  },
  text: {
    width: '100%',
    height: '100%',
    background: '#FFF',
    fontSize: props.size === 'sm' ? '12px' : '16px',
    padding: theme.spacing.md,
    color: theme.colors.text[0],
    overflowY: 'hidden',
    cursor: 'pointer',
    border: 'none',
  },
}));

export function TextSporeCoverRender(props: TextSporeRenderProps) {
  const { spore, ratio = 1 } = props;
  const [text, setText] = useState<string | ArrayBuffer>('');
  const { classes } = useStyles(props);

  useEffect(() => {
    fetch(`/api/media/${spore.id}`).then(async (res) => {
      const text = await res.text();
      setText(text);
    });
  }, [spore]);

  return (
    <AspectRatio ratio={ratio} bg="#F4F5F9">
      <Textarea
        classNames={{ wrapper: classes.wrapper, input: classes.text }}
        value={text.toString()}
        readOnly
      />
    </AspectRatio>
  );
}

export function TextSporeContentRender(props: TextSporeRenderProps) {
  const { spore } = props;
  const [reactContent, setMarkdownSource] = useRemark();

  useEffect(() => {
    fetch(`/api/media/${spore.id}`).then(async (res) => {
      const text = await res.text();
      setMarkdownSource(text);
    });
  }, [spore, setMarkdownSource]);

  if (!reactContent) {
    return null;
  }

  return <Box>{reactContent}</Box>;
}

const usePreviewStyles = createStyles((theme) => ({
  container: {
    width: '616px !important',
    height: '260px !important',
    borderColor: theme.colors.text[0],
    borderWidth: '1px',
    borderStyle: 'solid',
    borderRadius: '6px',
    backgroundColor: theme.colors.background[1],
    overflow: 'hidden',
  },
  text: {
    width: '616px !important',
    height: '260px !important',
    whiteSpace: 'pre-line',
    background: '#FFF',
    fontSize: '14px',
    padding: theme.spacing.md,
    color: theme.colors.text[0],
    border: 'none',

    '&::-webkit-scrollbar': {
      display: 'none',
    },

    [`@media (max-width: ${theme.breakpoints.sm})`]: {
      width: 'auto',
    },
  },
}));

export interface TextPreviewRenderProps {
  content: Blob;
}

export function TextPreviewRender(props: TextPreviewRenderProps) {
  const { content } = props;
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const [text, setText] = useState<string | ArrayBuffer | null>(null);
  const { classes } = usePreviewStyles();

  useEffect(() => {
    const reader = new window.FileReader();
    reader.readAsText(content);
    reader.onloadend = () => {
      setText(reader.result);
    };
  }, [content]);

  if (!text) {
    return null;
  }

  return (
    <Box className={classes.container}>
      <AspectRatio ratio={(isMobile ? 295 : 616) / 260}>
        <Textarea
          classNames={{ input: classes.text }}
          value={text.toString()}
          readOnly
        />
      </AspectRatio>
    </Box>
  );
}
