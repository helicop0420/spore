import useSponsorClusterModal from '@/hooks/modal/useSponsorClusterModal';
import useTransferClusterModal from '@/hooks/modal/useTransferClusterModal';
import { useConnect } from '@/hooks/useConnect';
import { isSameScript } from '@/utils/script';
import {
  AspectRatio,
  Box,
  Card,
  Flex,
  Image,
  SimpleGrid,
  Text,
  Title,
  createStyles,
  useMantineTheme,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconDotsVertical } from '@tabler/icons-react';
import Link from 'next/link';
import { useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import DropMenu from './DropMenu';
import SporeCoverRender from './SporeCoverRender';
import { QueryCluster } from '@/hooks/query/type';
import { useRouter } from 'next/router';

export interface ClusterCardProps {
  cluster: QueryCluster;
}

const useStyles = createStyles((theme) => ({
  card: {
    position: 'relative',
    borderRadius: '8px',
    borderWidth: '1px',
    borderColor: theme.colors.text[0],
    borderStyle: 'solid',
    boxShadow: `4px 4px 0px 0px ${theme.colors.text[0]}`,
    backgroundImage: 'url(/images/noise-on-yellow.png)',
    transition: 'border-radius 150ms ease',

    '&:hover': {
      borderRadius: '16px',
    },
  },
  description: {
    height: '21px',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  section: {
    borderBottomWidth: '1px',
    borderBottomColor: theme.colors.text[0],
    borderBottomStyle: 'solid',
  },
  skeleton: {
    height: '100%',
    width: '100%',
  },
  menu: {
    zIndex: 99,
    display: 'inline',
    position: 'absolute',
    bottom: '25px',
    right: '15px',
  },
}));

export function ClusterSkeletonCard() {
  const { classes } = useStyles();
  const theme = useMantineTheme();

  return (
    <Card p={0} className={classes.card}>
      <Card.Section px="md">
        <AspectRatio ratio={140 / 80}>
          <Skeleton className={classes.skeleton} baseColor={theme.colors.background[1]} />
        </AspectRatio>
      </Card.Section>

      <Box p="24px">
        <Text mb="8px">
          <Skeleton baseColor={theme.colors.background[1]} height="25px" borderRadius="16px" />
        </Text>
        <Text mb="8px" size="sm">
          <Skeleton baseColor={theme.colors.background[1]} height="20px" borderRadius="16px" />
        </Text>
        <Text color="text.0">
          <Skeleton
            baseColor={theme.colors.background[1]}
            height="26px"
            width="85px"
            borderRadius="16px"
          />
        </Text>
      </Box>
    </Card>
  );
}

export default function ClusterCard({ cluster }: ClusterCardProps) {
  const { classes } = useStyles();
  const theme = useMantineTheme();
  const { lock, address } = useConnect();
  const router = useRouter();
  const [hovered, { close, open }] = useDisclosure(false);

  const spores = cluster?.spores ?? [];
  const cols = spores.length >= 4 ? 2 : 1;

  const showActions = useMemo(() => {
    if (!cluster || !lock) {
      return false;
    }
    if (
      router.pathname === '/my' ||
      (router.pathname === '/[address]' && router.query.address === address)
    ) {
      return isSameScript(cluster.cell?.cellOutput.lock, lock);
    }
    return false;
  }, [cluster, lock, router.pathname, router.query.address, address]);

  const transferClusterModal = useTransferClusterModal(cluster);
  const sponsorClusterModal = useSponsorClusterModal(cluster);

  if (!cluster) {
    return <ClusterSkeletonCard />;
  }

  return (
    <Box
      sx={{ overflow: 'visible', position: 'relative' }}
      onMouseEnter={() => open()}
      onMouseLeave={() => close()}
    >
      <Link href={`/cluster/${cluster.id}`} style={{ textDecoration: 'none' }} passHref>
        <Card p={0} className={classes.card}>
          <Card.Section px="md" className={classes.section}>
            {spores.length > 0 ? (
              <SimpleGrid cols={cols} spacing="1px" bg="text.0">
                {spores.slice(0, cols * cols).map((spore) => {
                  return <SporeCoverRender key={spore.id} spore={spore} ratio={140 / 80} />;
                })}
              </SimpleGrid>
            ) : (
              <AspectRatio ratio={140 / 80}>
                <Flex justify="center" align="center" bg="background.1">
                  <Text color="text.0" size="xl">
                    No Spores
                  </Text>
                </Flex>
              </AspectRatio>
            )}
          </Card.Section>

          <Box p="24px">
            <Flex align="center" mb="8px">
              <Image
                src="/svg/cluster-icon.svg"
                alt="Cluster Icon"
                width="24px"
                height="24px"
                mr="8px"
              />
              <Title
                order={5}
                sx={{
                  textOverflow: 'ellipsis',
                  maxWidth: 'calc(100% - 32px)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                }}
                color="text.0"
              >
                {cluster.name}
              </Title>
            </Flex>
            <Text className={classes.description} mb="8px" size="sm" color="text.1">
              {cluster.description}
            </Text>
            <Text color="text.0">{spores.length} Spores</Text>
          </Box>
        </Card>
      </Link>

      {hovered && showActions && (
        <Box className={classes.menu}>
          <Flex align="center" justify="flex-end">
            <DropMenu
              menu={[
                {
                  type: 'item',
                  key: 'sponsor-spore',
                  title: (
                    <Flex align="center">
                      <Image
                        src="/svg/icon-add-capacity.svg"
                        width="18"
                        height="18"
                        alt="sponsor"
                      />
                      <Text ml="8px">Sponsor</Text>
                    </Flex>
                  ),
                  onClick: () => {
                    sponsorClusterModal.open();
                  },
                },
                {
                  type: 'item',
                  key: 'transfer-spore',
                  title: (
                    <Flex align="center">
                      <Image
                        src="/svg/icon-repeat.svg"
                        width="18"
                        height="18"
                        alt="transfer"
                        mr="8px"
                      />
                      <Text>Transfer</Text>
                    </Flex>
                  ),
                  onClick: (e) => {
                    e.preventDefault();
                    transferClusterModal.open();
                  },
                },
              ]}
            >
              <Flex align="center" sx={{ cursor: 'pointer' }}>
                <IconDotsVertical size="20px" color={theme.colors.text[0]} />
              </Flex>
            </DropMenu>
          </Flex>
        </Box>
      )}
    </Box>
  );
}
