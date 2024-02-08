import { transferCluster as _transferCluster } from '@spore-sdk/core';
import { BI, OutPoint } from '@ckb-lumos/lumos';
import { useCallback, useEffect, useRef } from 'react';
import { useDisclosure, useId, useMediaQuery } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { useConnect } from '../useConnect';
import { sendTransaction } from '@/utils/transaction';
import { useMutation } from '@tanstack/react-query';
import { showSuccess } from '@/utils/notifications';
import { modalStackAtom } from '@/state/modal';
import { useAtomValue } from 'jotai';
import SponsorModal from '@/components/SponsorModal';
import { useMantineTheme } from '@mantine/core';
import { QueryCluster } from '../query/type';
import { useClusterQuery } from '../query/useClusterQuery';
import { useClustersByAddressQuery } from '../query/useClustersByAddress';

export default function useSponsorClusterModal(cluster: QueryCluster | undefined) {
  const modalId = useId();
  const modalStack = useAtomValue(modalStackAtom);
  const theme = useMantineTheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const [opened, { open, close }] = useDisclosure(false);
  const { address, signTransaction, lock } = useConnect();
  const { data: { capacityMargin } = {}, refresh: refreshCluster } = useClusterQuery(
    cluster?.id,
    opened,
  );
  const { refresh: refreshClustersByAddress } = useClustersByAddressQuery(address, false);
  const nextCapacityMarginRef = useRef<string | undefined>();

  const sponsorCluster = useCallback(
    async (...args: Parameters<typeof _transferCluster>) => {
      const { txSkeleton, outputIndex } = await _transferCluster(...args);
      const signedTx = await signTransaction(txSkeleton);
      const txHash = await sendTransaction(signedTx);
      return {
        txHash,
        index: BI.from(outputIndex).toHexString(),
      } as OutPoint;
    },
    [signTransaction],
  );

  const sponsorClusterMutation = useMutation({
    mutationFn: sponsorCluster,
    onSuccess: async () => {
      refreshClustersByAddress();
      await refreshCluster();
    },
  });
  const loading = sponsorClusterMutation.isPending && !sponsorClusterMutation.isError;

  const handleSubmit = useCallback(
    async (values: { amount: number }) => {
      if (!address || !values.amount || !cluster) {
        return;
      }
      const { amount } = values;
      const nextCapacityMargin = BI.from(capacityMargin).add(BI.from(amount).mul(100_000_000));
      nextCapacityMarginRef.current = nextCapacityMargin.toHexString();

      await sponsorClusterMutation.mutateAsync({
        outPoint: cluster.cell?.outPoint!,
        fromInfos: [address],
        toLock: lock!,
        capacityMargin: nextCapacityMargin.toHexString(),
        useCapacityMarginAsFee: false,
      });
      showSuccess(`${amount.toLocaleString('en-US')} CKByte sponsored to Cluster!`);
      modals.close(modalId);
    },
    [address, cluster, sponsorClusterMutation, modalId, capacityMargin, lock],
  );

  useEffect(() => {
    if (opened) {
      modals.open({
        modalId,
        title: `Sponsor Cluster`,
        onClose: () => {
          close();
          const nextModal = modalStack.pop();
          if (nextModal) {
            nextModal.open();
          }
        },
        styles: {
          content: {
            minWidth: isMobile ? 'auto' : '560px',
          },
        },
        closeOnEscape: !sponsorClusterMutation.isPending,
        withCloseButton: !sponsorClusterMutation.isPending,
        closeOnClickOutside: !sponsorClusterMutation.isPending,
        children: <SponsorModal type="cluster" data={cluster!} onSubmit={handleSubmit} />,
      });
    } else {
      modals.close(modalId);
    }
  }, [
    cluster,
    sponsorClusterMutation.isPending,
    handleSubmit,
    opened,
    close,
    modalId,
    modalStack,
    isMobile,
  ]);

  return {
    open,
    close,
    loading,
  };
}
