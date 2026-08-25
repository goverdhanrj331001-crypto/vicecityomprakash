import React from 'react';
import type { ModVersion } from '@/types';

interface DownloadModalProps {
  versions: ModVersion[];
}

export function DownloadModal({ versions }: DownloadModalProps) {
  return (
    <div className="modal fade" id="downloadModal" tabIndex={-1} role="dialog">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-body">
            <div className="panel panel-default">
              <div className="panel-body">
                <h3 className="mt-0">
                  <i className="fa fa-list-alt" />
                  All Versions
                </h3>
                {versions.map((v) => (
                  <div key={v.version} className="well pull-left file-version-container">
                    <div className="pull-left">
                      <i className="fa fa-file" />
                      &nbsp;{v.version} {v.isCurrent && <span>(current)</span>}
                      <p>
                        <span className="num-downloads">
                          {v.downloads} downloads <span className="file-size">, {v.fileSize}</span>
                        </span>
                        <br />
                        <span className="num-downloads">{v.uploadedAt}</span>
                      </p>
                    </div>
                    <div className="pull-right">
                      {v.virusTotalUrl && (
                        <a target="_blank" rel="noreferrer" href={v.virusTotalUrl}>
                          <i className="fa fa-shield vt-version" />
                        </a>
                      )}
                      <a target="_blank" rel="noreferrer" href={v.downloadUrl}>
                        <i className="fa fa-download download-version" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-default" data-dismiss="modal">
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
