import { Button, Space } from 'antd';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Supervisor, Workspace } from 'twilio-taskrouter';
import type { RootState } from '../../../stores';
import TwilioInboundCallModal from './TwilioInboundCallModal';

export default function TwilioInboundTaskRouter({
  debug,
}: {
  debug?: boolean;
}) {
  const settings = useSelector((state: RootState) => state?.app?.settings);

  const [open, setOpen] = useState(false);

  const [workSpace, setWorkSpace] = useState<Workspace | null>(null);
  const [workerObj, setWorkerObj] = useState<Supervisor | null>(null);
  const [reservationObj, setReservationObj] = useState<any>(null);

  const [enableAccept, setEnableAccept] = useState(false);
  const [enableReject, setEnableReject] = useState(false);
  const [enableDisconnectWorker, setEnableDisconnectWorker] = useState(false);

  const [currentReservations, setCurrentReservations] = useState<any[]>([]);

  const handleFetchWorkersInfo = async () => {
    try {
      const fetchWorkersInfoReq = await workSpace?.fetchWorkersInfo();
      if (fetchWorkersInfoReq) {
        const workers = Array.from(fetchWorkersInfoReq.values());
        console.log('======================================================');
        console.log('Workers fetched');
        workers.forEach((worker) => {
          console.log('Workers sid: ' + worker.sid);
          console.log('Workers friendlyName: ' + worker.friendlyName);
          console.log('Workers activity: ' + worker.activityName);
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDisconnectWorker = () => {
    if (workerObj) {
      workerObj.disconnect();
    }
  };

  const handleAccept = () => {
    console.log(`handleAccept clicked--Reservation-- ${reservationObj?.sid}`);

    if (reservationObj) {
      reservationObj
        ?.accept()
        .then((acceptedReservation: any) => {
          console.log(
            `Accept Reservation--Reservation status is ${acceptedReservation.status}`,
            'green'
          );
        })
        .catch((err: any) => {
          console.log(`Accept Reservation--Error: ${err}`, 'red');
        });
    }
  };

  const handleReject = () => {
    console.log(`handleReject clicked--Reservation-- ${reservationObj?.sid}`);

    if (reservationObj) {
      reservationObj
        ?.reject()
        .then((acceptedReservation: any) => {
          console.log(
            `Reject Reservation--Reservation status is ${acceptedReservation.status}`,
            'green'
          );
        })
        .catch((err: any) => {
          console.log(`Reject Reservation--Error: ${err}`, 'red');
        });
    }
  };

  useEffect(() => {
    if (!settings?.telecomOptions?.token) {
      return;
    }

    const worker = new Supervisor(settings?.telecomOptions?.token, {
      region: 'us1',
      logLevel: 'debug',
    });

    const workspace = new Workspace(settings?.telecomOptions?.token, {
      region: 'us1',
      logLevel: 'debug',
    });

    setWorkSpace(workspace);
    setWorkerObj(worker);

    return () => {
      if (worker) {
        worker.disconnect();
      }
    };
  }, [settings]);

  useEffect(() => {
    if (!workerObj) {
      return;
    }

    workerObj.on('ready', (readyWorker) => {
      console.log(
        `ready--Worker ${readyWorker.sid} : ${readyWorker.friendlyName} is now ready for work`,
        'green'
      );

      setEnableDisconnectWorker(true);
    });

    workerObj.on('tokenExpired', () => {
      console.log(
        `tokenExpired--Worker ${workerObj?.sid} : ${workerObj?.friendlyName}'s token expired`
      );
    });

    workerObj.on('tokenUpdated', () => {
      console.log(
        `tokenUpdated--Worker ${workerObj?.sid} : ${workerObj?.friendlyName}'s token updated`
      );
    });

    workerObj.on('activityUpdated', (readyWorker) => {
      console.log(
        `activityUpdated--Worker ${readyWorker?.sid} : ${readyWorker?.friendlyName}'s activity Updated`
      );
    });

    workerObj.on('attributesUpdated', (readyWorker) => {
      console.log(
        `attributesUpdated--Worker ${readyWorker?.sid} : ${readyWorker?.friendlyName}'s attributes Updated`
      );
    });

    workerObj.on('disconnected', (reason) => {
      console.log(
        `disconnected--Worker is disconnected. reason: ${JSON.stringify(
          reason
        )}`
      );

      setEnableDisconnectWorker(false);
      setEnableAccept(false);
      setEnableReject(false);
      setCurrentReservations([]);
      setOpen(false);
    });

    workerObj.on('error', (error) => {
      console.log(
        `error--Worker errored out. error: ${JSON.stringify(error)}`,
        'red'
      );

      workerObj.disconnect();
    });

    workerObj.on('reservationFailed', (reservation) => {
      console.log(
        `reservationFailed--Reservation ${reservation.sid} failed for ${workerObj.sid}`
      );
    });

    workerObj.on('reservationCreated', (reservation) => {
      // setOpen(true);
      setReservationObj(reservation);
      // setEnableAccept(true);
      // setEnableReject(true);

      console.log(
        `reservationCreated--Reservation ${reservation.sid} has been created for ${workerObj.sid}`
      );

      console.log('reservationCreated--Task attributes are: ');
      console.log(JSON.stringify(reservation?.task?.attributes || {}));
    });
  }, [workerObj]);

  useEffect(() => {
    if (!reservationObj) {
      return;
    }

    reservationObj.on('accepted', (acceptedReservation: any) => {
      console.log(
        `reservationCreated--Reservation ${acceptedReservation.sid} was accepted.`,
        'green'
      );

      setEnableAccept(false);
      setEnableReject(false);
    });

    reservationObj.on('pending', (acceptedReservation: any) => {
      console.log(
        `reservationCreated--Reservation ${acceptedReservation.sid} is pending.`
      );
    });
    reservationObj.on('rejected', (acceptedReservation: any) => {
      console.log(
        `reservationCreated--Reservation ${acceptedReservation.sid} was rejected.`,
        'green'
      );

      setEnableAccept(false);
      setEnableReject(false);
    });
    reservationObj.on('timeout', (acceptedReservation: any) => {
      console.log(
        `reservationCreated--Reservation ${acceptedReservation.sid} is timeout.`,
        'red'
      );

      setEnableAccept(false);
      setEnableReject(false);
      setEnableDisconnectWorker(false);
    });
    reservationObj.on('canceled', (acceptedReservation: any) => {
      console.log(
        `reservationCreated--Reservation ${acceptedReservation.sid} is canceled.`
      );

      setEnableAccept(false);
      setEnableReject(false);
      setEnableDisconnectWorker(false);
    });
    reservationObj.on('rescinded', (acceptedReservation: any) => {
      console.log(
        `reservationCreated--Reservation ${acceptedReservation.sid} is rescinded.`
      );
    });
    reservationObj.on('wrapping', (acceptedReservation: any) => {
      console.log(
        `reservationCreated--Reservation ${acceptedReservation.sid} is wrapping.`
      );
    });
    reservationObj.on('completed', (acceptedReservation: any) => {
      console.log(
        `reservationCreated--Reservation ${acceptedReservation.sid} is completed.`
      );

      setEnableAccept(false);
      setEnableReject(false);
      setEnableDisconnectWorker(false);
    });

    // update reservation table
    if (workerObj && workerObj.reservations) {
      const reservationArr: any[] = [];

      for (const reservation of workerObj.reservations.values()) {
        reservationArr.push({
          sid: reservation.sid,
          status: reservation.status,
          task: {
            sid: reservation.task.sid,
            status: reservation.task.status,
            priority: reservation.task.priority,
            queueName: reservation.task.queueName,
            taskChannelUniqueName: reservation.task.taskChannelUniqueName,
          },
        });
      }

      setCurrentReservations(reservationArr);
    }
  }, [reservationObj, workerObj]);

  return (
    <>
      {debug && (
        <div className='rounded-sm border border-red-500 bg-red-50 p-2'>
          <Space>
            <div className='rounded-sm border border-cyan-500 bg-cyan-50 p-2'>
              {JSON.stringify(currentReservations)}
            </div>

            <Space>
              <Button onClick={() => handleAccept()} disabled={!enableAccept}>
                Accept
              </Button>

              <Button onClick={() => handleReject()} disabled={!enableReject}>
                Reject
              </Button>
            </Space>

            <Space style={{ marginTop: 16 }}>
              <Button
                onClick={() => handleDisconnectWorker()}
                disabled={!enableDisconnectWorker}
              >
                Disconnect Worker
              </Button>

              <Button onClick={() => handleFetchWorkersInfo()}>
                Fetch Workers Info
              </Button>
            </Space>
          </Space>
        </div>
      )}

      <TwilioInboundCallModal open={open} onOpenChange={setOpen} />
    </>
  );
}
